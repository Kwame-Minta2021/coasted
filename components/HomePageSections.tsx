'use client';

import { motion } from 'framer-motion';
import { 
  Code, 
  Bot, 
  Brain, 
  Users, 
  Shield, 
  Award, 
  Play, 
  ArrowRight, 
  Star, 
  Clock, 
  Target, 
  Sparkles,
  CheckCircle,
  BookOpen,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  GraduationCap,
  Trophy,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Rocket,
  Gamepad2,
  Music,
  Video,
  Palette,
  Lightbulb,
  Cpu,
  Database,
  Cloud,
  Lock,
  Eye,
  TrendingUp,
  Calendar,
  BookOpenCheck
} from 'lucide-react';
import Link from 'next/link';

// Professional data for the homepage
const heroFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Personalized curriculum that adapts to each student's pace",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Bot,
    title: "Robotics & Automation",
    description: "Hands-on experience with cutting-edge technologies",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Programming & Cybersecurity",
    description: "Learn safe coding practices and cybersecurity fundamentals for kids",
    color: "from-green-500 to-emerald-500"
  }
];

const stats = [
  { number: "100+", label: "Students Enrolled", icon: Users, color: "from-blue-500 to-cyan-500" },
  { number: "25+", label: "Expert Instructors", icon: GraduationCap, color: "from-purple-500 to-pink-500" },
  { number: "95%", label: "Success Rate", icon: Trophy, color: "from-green-500 to-emerald-500" },
  { number: "24/7", label: "Support Available", icon: MessageCircle, color: "from-orange-500 to-red-500" }
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Personalized curriculum that adapts to each student's learning pace and style with intelligent recommendations.",
    color: "from-blue-500 to-cyan-500",
    delay: 0.1
  },
  {
    icon: Bot,
    title: "Robotics & Automation",
    description: "Hands-on experience with cutting-edge robotics and automation technologies in our state-of-the-art labs.",
    color: "from-purple-500 to-pink-500",
    delay: 0.2
  },
  {
    icon: Shield,
    title: "Programming & Cybersecurity",
    description: "Master safe coding practices, cybersecurity fundamentals, and ethical hacking concepts through hands-on projects.",
    color: "from-green-500 to-emerald-500",
    delay: 0.3
  },
  {
    icon: Users,
    title: " Online Classes",
    description: "Real-time interaction with expert instructorsv with small class sizes for personalized attention.",
    color: "from-orange-500 to-red-500",
    delay: 0.4
  },
  {
    icon: Shield,
    title: "Parental Controls",
    description: "Advanced screen time management and learning progress tracking with detailed analytics and reports.",
    color: "from-indigo-500 to-blue-500",
    delay: 0.5
  },
  {
    icon: Brain,
    title: "AI Portfolio Creation",
    description: "Build an impressive AI portfolio showcasing your projects, skills, and achievements for future opportunities.",
    color: "from-yellow-500 to-orange-500",
    delay: 0.6
  }
];

const testimonials = [
  {
    name: "Mariam Akogo",
    role: "Parent",
    content: "My daughter has learned so much through Coasted Code. The AI-powered learning makes it fun and engaging!",
    rating: 5,
    avatar: "👩‍👧",
   
  },
  {
    name: "Michael Nyini",
    role: "Student",
    content: "The robotics classes are amazing! I've built my own robot and learned Python programming.",
    rating: 5,
    avatar: "👨‍🎓",
    
  },
  {
    name: "Emma Minta",
    role: "Parent",
    content: "The mentors are incredible and my son has gained so much confidence in his coding abilities.",
    rating: 4.5,
    avatar: "👩‍👦",
    
  }
];

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto text-center"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex items-center justify-center mb-8"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <Code className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
          >
            Coasted Code
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl lg:text-3xl text-slate-600 dark:text-slate-400 font-medium mb-8"
          >
            Hybrid AI, Robotics & Coding School
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12"
          >
            Empowering students aged 6-17 with cutting-edge technology education through  online classes, 
            in-person labs, and AI-powered personalized learning experiences.
          </motion.p>
        </motion.div>

        {/* Explore Programs CTA */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center items-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/courses" 
              className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-6 h-6" />
              </motion.div>
              <span>Explore Programs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Features */}
        <motion.div 
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
        >
           {heroFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="text-center group"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl`}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 + index * 0.1, type: "spring", stiffness: 200 }}
                className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
              >
                {stat.number}
              </motion.div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Why Choose Coasted Code?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Our innovative approach combines the best of online and in-person learning with cutting-edge technology.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Success Stories & Actionable Tips
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Real feedback from our community with practical recommendations you can implement today.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-slate-700 dark:text-slate-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="mb-6">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              
              {/* Actionable Recommendations */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">
                  💡 {testimonial.role === 'Parent' ? 'Parent Tip' : 'Student Advice'}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                  {testimonial.recommendation}
                </p>
                <div className="space-y-2">
                  <h5 className="font-medium text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">
                    Action Steps:
                  </h5>
                  {testimonial.actionable.map((action, actionIndex) => (
                    <div key={actionIndex} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-3xl p-12 text-white shadow-2xl"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            Ready to Start Learning?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl mb-8 opacity-90"
          >
            Join thousands of students already learning with Coasted Code
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/courses"
                className="group bg-white text-blue-600 font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
              >
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Enroll Now
                </motion.span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/contact"
                className="group bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
              >
                <span>Contact Us</span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Default export for dynamic import
export default function HomePageSections() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
