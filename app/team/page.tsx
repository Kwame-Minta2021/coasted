'use client'

import Section from '@/components/Section'
import Image from 'next/image'

const teamMembers = [
  {
    name: ' Frederick Kwame Minta',
    role: 'Founder & Lead Instructor',
    image: '/team/images/Fred.png',
    bio: 'Computer Science & Engineering with 4+ years teaching experience. Passionate about making coding accessible to young minds.',
    expertise: ['Python', 'AI/ML', 'Robotics', 'Curriculum Design'],
    education: 'Computer Science & Engineering, University of Mines and Technology',
    linkedin: 'https://www.linkedin.com/in/minta-frederick-kwame/',
    github: 'https://github.com/Kwame-Minta2021',
    email: 'frederickminta@gmail.com'
  },
  {
    name: ' Ellen Adwoa Nyini',
    role: 'Robotics & Electronics Specialist',
    image: '/team/images/Ellen.png',
    bio: 'Computer Science & Engineering with expertise in Arduino, Raspberry Pi, and hands-on robotics projects.',
    expertise: ['Arduino', 'Raspberry Pi', 'Circuit Design', '3D Printing'],
    education: 'BSc Computer Science & Engineering, UMaT',
    linkedin: 'https://www.linkedin.com/in/ellen-adwoa-nyini-38a372214?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    github: '#',
    email: 'ellennyini@gmail.com'
  },
  {
    name: 'Esther Ilori-Folarin',
    role: 'Cybersecurity Specialist and Child Online Safety Advocate',
    image: '/team/images/Esther.png',
    bio: 'Cybersecurity specialist and child online safety advocate, Ensuring children are safe online.',
    expertise: ['Online Safety', 'Cybersecurity', 'Child Protection', 'Digital Literacy'],
    education: 'Computer Science, Academic City University',
    linkedin: 'https://www.linkedin.com/in/esther-ilori-folarin/',
    github: '#',
    email: 'estherifeoluwa091@gmail.com'
  },
  {
    name: 'Kennedy Akogo',
    role: 'AI & Machine Learning Instructor',
    image: '/team/images/Kenn.png',
    bio: 'AI & Machine Learning Instructor who makes complex concepts simple and fun.',
    expertise: ['AI', 'Machine Learning', 'Python', 'TensorFlow'],
    education: 'BSc Computer Science, University of Mines and Technology',
    linkedin: 'http://www.linkedin.com/in/kennedy-akogo-348429227',
    github: '#',
    email: 'akogokennedy@gmail.com'
  },
  {
    name: 'Linda Essilfie',
    role: 'Student Mentor and Emotional Health Specialist and Courses Coordinator',
    image: '/team/images/Linda.png',
    bio: 'Education specialist focused on student engagement and parent communication. Ensures every child thrives.',
    expertise: ['Student Support', 'Parent Communication', 'Learning Assessment', 'Safeguarding'],
    education: 'Biomedical Engineering, Academic City University',
    linkedin: '#',
    github: '#',
    email: 'Linda.Essilfie@acity.edu.gh'
  },
    {
      name: 'Albert Essilfie',
      role: 'Industrial and Partner Relations',
      image: '/team/images/Albert.jpg', // Using placeholder image until Albert.jpg is available
      bio: 'Systems Engineer with a passion for building partnerships with schools and organizations across Ghana.',
      expertise: ['Operations Management', 'Business Strategy', 'Community Outreach'],
      education: 'Masters in Systems Engineering,GWU(USA)',
      linkedin: '#',
      github: '#',
      email: 'albertessilfie71@gmail.com'
    }
]


export default function TeamPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Section className="relative overflow-hidden pb-0">
        <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-900/30 transition-colors duration-300" />
        <div className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl dark:bg-emerald-900/30 transition-colors duration-300" />
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl transition-colors duration-300">
            Meet Our Team
          </h1>
          <p className="mt-4 text-lg text-muted-foreground transition-colors duration-300 max-w-3xl mx-auto">
            Passionate educators, engineers, and innovators dedicated to inspiring the next generation of tech leaders in Ghana.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="cc-btn-primary cc-cta-ring">Join Our Team</div>
            <div className="cc-btn-outline">Partner With Us</div>
          </div>
        </div>
      </Section>

      {/* Mission Statement */}
      <Section className="bg-card transition-colors duration-300">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground transition-colors duration-300 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-muted-foreground transition-colors duration-300 leading-relaxed">
            To democratize access to quality STEM education in Ghana, empowering young minds with the skills, 
            confidence, and creativity to become the innovators and problem-solvers of tomorrow. We believe 
            every child deserves the opportunity to explore, create, and build with technology.
          </p>
        </div>
      </Section>

      {/* Team Members Grid */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground transition-colors duration-300 mb-4">
            The People Behind Coasted Code
          </h2>
          <p className="text-lg text-muted-foreground transition-colors duration-300">
            Meet our diverse team of educators, engineers, and innovators
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group"
            >
              <div className="cc-card p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto relative rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                    <Image 
                      src={member.image}
                      alt={member.name}
                      className="object-cover"
                      fill
                      sizes="128px"
                      priority={false}
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', member.image);
                        e.currentTarget.src = '/team/images/Fred.png'; // Fallback image
                      }}
                    />
                  </div>
                </div>

                {/* Member Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-card-foreground transition-colors duration-300 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold transition-colors duration-300 mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground transition-colors duration-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Expertise Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="mb-4 text-center">
                  <p className="text-xs text-muted-foreground transition-colors duration-300">
                    {member.education}
                  </p>
                </div>

                {/* Contact Links */}
                <div className="flex justify-center gap-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-lg bg-primary text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-md"
                    aria-label={`Email ${member.name}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </a>
                  <a
                    href={member.linkedin}
                    className="p-2 rounded-lg bg-blue-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-md"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href={member.github}
                    className="p-2 rounded-lg bg-gray-800 text-white transition-all duration-300 hover:scale-110 hover:shadow-md"
                    aria-label={`${member.name} on GitHub`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Values Section */}
      <Section className="bg-card transition-colors duration-300">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground transition-colors duration-300 mb-4">
            Our Values
          </h2>
          <p className="text-lg text-muted-foreground transition-colors duration-300">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: '🎯',
              title: 'Excellence',
              description: 'We strive for the highest quality in everything we do, from curriculum design to student support.'
            },
            {
              icon: '🤝',
              title: 'Inclusivity',
              description: 'Every child deserves access to quality STEM education, regardless of background or circumstances.'
            },
            {
              icon: '💡',
              title: 'Innovation',
              description: 'We continuously evolve our teaching methods and embrace new technologies to enhance learning.'
            },
            {
              icon: '❤️',
              title: 'Passion',
              description: 'Our love for teaching and technology drives us to inspire the next generation of innovators.'
            }
          ].map((value, index) => (
            <div
              key={value.title}
              className="text-center"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-foreground transition-colors duration-300 mb-2">
                {value.title}
              </h3>
              <p className="text-muted-foreground transition-colors duration-300">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Join Us CTA */}
      <Section>
        <div className="cc-card p-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground transition-colors duration-300 mb-4">
            Join Our Mission
          </h2>
          <p className="text-lg text-muted-foreground transition-colors duration-300 mb-6 max-w-2xl mx-auto">
            We're always looking for passionate educators, engineers, and innovators to join our team. 
            Help us shape the future of STEM education in Ghana.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="cc-btn-primary cc-cta-ring">Apply to Join Our Team</a>
            <a href="#contact" className="cc-btn-outline">Partner With Us</a>
          </div>
        </div>
      </Section>
    </main>
  )
}
