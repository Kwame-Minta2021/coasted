import { supabaseAdmin } from '../supabase';
import { User, UserEnrollmentData, UserUpdateData, AuthResponse, UserRole, PaymentStatus } from '../../types/user';
import { ValidationError, UserNotFoundError, UserAlreadyExistsError, DatabaseError } from '../errors';
import { userEnrollmentSchema, userUpdateSchema, sanitizeEmail, sanitizeString } from '../validation';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../email';

export class UserService {
  private readonly usersCollection = 'users';

  /**
   * Enroll a new user with comprehensive validation and data storage
   */
  async enrollUser(userData: UserEnrollmentData): Promise<AuthResponse> {
    try {
      // Validate input data
      const validatedData = userEnrollmentSchema.parse(userData);
      
      // Sanitize data
      const sanitizedData = {
        ...validatedData,
        email: sanitizeEmail(validatedData.email),
        firstName: sanitizeString(validatedData.firstName),
        lastName: sanitizeString(validatedData.lastName),
        phone: validatedData.phone ? sanitizeString(validatedData.phone) : undefined,
      };

      // Check if user already exists
      const existingUser = await this.getUserByEmail(sanitizedData.email);
      if (existingUser) {
        throw new UserAlreadyExistsError(sanitizedData.email);
      }

      // Create Supabase Auth user
      const { data: created, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: sanitizedData.email,
        password: sanitizedData.password,
        email_confirm: false,
        user_metadata: {
          firstName: sanitizedData.firstName,
          lastName: sanitizedData.lastName,
          phone: sanitizedData.phone,
        },
      });
      if (createUserError || !created?.user) {
        throw new DatabaseError(`Failed to create user: ${createUserError?.message || 'Unknown error'}`);
      }
      const userId = created.user.id;

      // Prepare user document data
      const now = new Date();
      const userDoc: Omit<User, 'uid'> = {
        email: sanitizedData.email,
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        phone: sanitizedData.phone,
        enrollmentDate: now,
        isActive: true,
        paymentStatus: 'pending' as PaymentStatus,
        subscriptionPlan: sanitizedData.subscriptionPlan,
        profileData: sanitizedData.profileData ? {
          dateOfBirth: sanitizedData.profileData.dateOfBirth,
          gender: sanitizedData.profileData.gender,
          address: sanitizedData.profileData.address ? {
            street: sanitizedData.profileData.address.street || '',
            city: sanitizedData.profileData.address.city || '',
            state: sanitizedData.profileData.address.state || '',
            zipCode: sanitizedData.profileData.address.zipCode || '',
            country: sanitizedData.profileData.address.country || ''
          } : undefined,
          emergencyContact: sanitizedData.profileData.emergencyContact ? {
            name: sanitizedData.profileData.emergencyContact.name || '',
            relationship: sanitizedData.profileData.emergencyContact.relationship || '',
            phone: sanitizedData.profileData.emergencyContact.phone || '',
            email: sanitizedData.profileData.emergencyContact.email
          } : undefined,
          preferences: sanitizedData.profileData.preferences ? {
            notifications: sanitizedData.profileData.preferences.notifications ?? true,
            marketingEmails: sanitizedData.profileData.preferences.marketingEmails ?? false,
            theme: sanitizedData.profileData.preferences.theme || 'auto'
          } : undefined
        } : undefined,
        createdAt: now,
        updatedAt: now,
        emailVerified: false,
        role: 'student' as UserRole,
        loginCount: 0,
      };

      // Store user data in Supabase
      const { error: insertError } = await supabaseAdmin
        .from(this.usersCollection)
        .insert({ id: userId, ...userDoc });
      if (insertError) {
        throw new DatabaseError(`Failed to save user profile: ${insertError.message}`);
      }

      // Send welcome email
      try {
        await sendWelcomeEmail(sanitizedData.email, sanitizedData.firstName);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the enrollment if email fails
      }

      return {
        success: true,
        user: { uid: userId, ...userDoc },
        message: 'User enrolled successfully',
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof UserAlreadyExistsError) {
        throw error;
      }
      throw new DatabaseError(`Failed to enroll user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Complete user profile after initial enrollment
   */
  async completeUserProfile(userId: string, profileData: Partial<User['profileData']>): Promise<User> {
    try {
      const { data: existing, error } = await supabaseAdmin
        .from(this.usersCollection)
        .select('*')
        .eq('id', userId)
        .single();
      if (error || !existing) {
        throw new UserNotFoundError(userId);
      }

      const updateData = {
        profileData: {
          ...(existing as any).profileData,
          ...profileData,
        },
        updatedAt: new Date(),
      };

      const { data: updated, error: updateError } = await supabaseAdmin
        .from(this.usersCollection)
        .update(updateData)
        .eq('id', userId)
        .select('*')
        .single();
      if (updateError || !updated) {
        throw new DatabaseError(`Failed to update profile: ${updateError?.message || 'Unknown error'}`);
      }
      return { uid: userId, ...(updated as any) } as User;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Failed to complete user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.usersCollection)
        .select('*')
        .eq('id', userId)
        .single();
      if (error || !data) return null;
      return { uid: userId, ...(data as any) } as User;
    } catch (error) {
      throw new DatabaseError(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const sanitizedEmail = sanitizeEmail(email);
      const { data, error } = await supabaseAdmin
        .from(this.usersCollection)
        .select('*')
        .eq('email', sanitizedEmail)
        .limit(1)
        .maybeSingle();
      if (error || !data) return null;
      return { uid: (data as any).id, ...(data as any) } as User;
    } catch (error) {
      throw new DatabaseError(`Failed to get user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updateData: UserUpdateData): Promise<User> {
    try {
      // Validate update data
      const validatedData = userUpdateSchema.parse(updateData);

      // Sanitize data
      const sanitizedData = {
        ...validatedData,
        firstName: validatedData.firstName ? sanitizeString(validatedData.firstName) : undefined,
        lastName: validatedData.lastName ? sanitizeString(validatedData.lastName) : undefined,
        phone: validatedData.phone ? sanitizeString(validatedData.phone) : undefined,
      };

      const { data: existing, error: getError } = await supabaseAdmin
        .from(this.usersCollection)
        .select('id')
        .eq('id', userId)
        .single();
      if (getError || !existing) {
        throw new UserNotFoundError(userId);
      }

      const updatePayload = {
        ...sanitizedData,
        updatedAt: new Date(),
      } as any;

      const { data: updated, error: updateError } = await supabaseAdmin
        .from(this.usersCollection)
        .update(updatePayload)
        .eq('id', userId)
        .select('*')
        .single();
      if (updateError || !updated) {
        throw new DatabaseError(`Failed to update user profile: ${updateError?.message || 'Unknown error'}`);
      }
      return { uid: userId, ...(updated as any) } as User;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Failed to update user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update user payment status
   */
  async updatePaymentStatus(userId: string, paymentStatus: PaymentStatus): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from(this.usersCollection)
        .update({ paymentStatus, updatedAt: new Date() })
        .eq('id', userId);
      if (error) {
        throw new DatabaseError(`Failed to update payment status: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Failed to update payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update user subscription plan
   */
  async updateSubscriptionPlan(userId: string, subscriptionPlan: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from(this.usersCollection)
        .update({ subscriptionPlan, updatedAt: new Date() })
        .eq('id', userId);
      if (error) {
        throw new DatabaseError(`Failed to update subscription plan: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Failed to update subscription plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update user login information
   */
  async updateLoginInfo(userId: string): Promise<void> {
    try {
      const { data: existing, error: getError } = await supabaseAdmin
        .from(this.usersCollection)
        .select('loginCount')
        .eq('id', userId)
        .single();
      if (getError || !existing) {
        throw new UserNotFoundError(userId);
      }
      const currentLoginCount = (existing as any).loginCount || 0;
      const { error } = await supabaseAdmin
        .from(this.usersCollection)
        .update({
          lastLoginAt: new Date(),
          loginCount: currentLoginCount + 1,
          updatedAt: new Date(),
        })
        .eq('id', userId);
      if (error) {
        throw new DatabaseError(`Failed to update login info: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Failed to update login info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from(this.usersCollection)
        .update({ emailVerified: true, updatedAt: new Date() })
        .eq('id', userId);
      if (error) {
        throw new DatabaseError(`Failed to verify email: ${error.message}`);
      }
    } catch (error) {
      throw new DatabaseError(`Failed to verify email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      const { error } = await supabaseAdmin
        .from(this.usersCollection)
        .delete()
        .eq('id', userId);
      if (error) {
        throw new DatabaseError(`Failed to delete user profile: ${error.message}`);
      }
    } catch (error) {
      throw new DatabaseError(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.usersCollection)
        .select('*')
        .order('createdAt', { ascending: false })
        .range(offset, offset + limit - 1);
      if (error || !data) return [];
      return (data as any[]).map(row => ({ uid: (row as any).id, ...(row as any) })) as User[];
    } catch (error) {
      throw new DatabaseError(`Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search users by criteria
   */
  async searchUsers(criteria: {
    email?: string;
    firstName?: string;
    lastName?: string;
    paymentStatus?: PaymentStatus;
    role?: UserRole;
  }, limit: number = 50): Promise<User[]> {
    try {
      let query = supabaseAdmin
        .from(this.usersCollection)
        .select('*')
        .limit(limit);

      // Build filters
      const filters: { column: string; value: any }[] = [];
      if (criteria.email) filters.push({ column: 'email', value: sanitizeEmail(criteria.email) });
      if (criteria.firstName) filters.push({ column: 'firstName', value: sanitizeString(criteria.firstName) });
      if (criteria.lastName) filters.push({ column: 'lastName', value: sanitizeString(criteria.lastName) });
      if (criteria.paymentStatus) filters.push({ column: 'paymentStatus', value: criteria.paymentStatus });
      if (criteria.role) filters.push({ column: 'role', value: criteria.role });

      for (const f of filters) {
        // @ts-ignore chainable
        query = (query as any).eq(f.column, f.value);
      }

      const { data, error } = await (query as any);
      if (error || !data) return [];
      return (data as any[]).map(row => ({ uid: (row as any).id, ...(row as any) })) as User[];
    } catch (error) {
      throw new DatabaseError(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const userService = new UserService();
