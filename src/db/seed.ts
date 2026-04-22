import { PrismaClient, AccountType, VerificationStatus, VerificationBadge, StartupTier, JobListingType, WorkMode, ExperienceLevel, EmploymentType, ProficiencyLevel } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.report.deleteMany();
  await prisma.threatScanLog.deleteMany();
  await prisma.aiMatch.deleteMany();
  await prisma.application.deleteMany();
  await prisma.jobListing.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.projectMedia.deleteMany();
  await prisma.project.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.themeConfig.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.companyVerification.deleteMany();
  await prisma.identityVerification.deleteMany();
  await prisma.user.deleteMany();

  // Helper function to hash passwords
  const hashPassword = (password: string) => bcryptjs.hashSync(password, 10);

  // Create individual users (job seekers)
  console.log('👤 Creating individual users...');
  const individuals = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        passwordHash: hashPassword('password123'),
        accountType: AccountType.INDIVIDUAL,
        verificationStatus: VerificationStatus.VERIFIED,
        verificationBadge: VerificationBadge.INDIVIDUAL_VERIFIED,
        profile: {
          create: {
            headline: 'Full Stack Developer | React & Node.js',
            bio: 'Passionate about building scalable web applications. 5+ years of experience.',
            location: 'San Francisco, CA',
            openToWork: true,
            profileScore: 85,
          },
        },
        settings: {
          create: {
            enableAISuggestions: true,
            preferredJobTypes: ['JOB', 'FREELANCE'],
            preferredWorkModes: ['ONLINE', 'HYBRID'],
            preferredIndustries: ['Technology', 'Startups'],
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        passwordHash: hashPassword('password123'),
        accountType: AccountType.INDIVIDUAL,
        verificationStatus: VerificationStatus.VERIFIED,
        verificationBadge: VerificationBadge.INDIVIDUAL_VERIFIED,
        profile: {
          create: {
            headline: 'Product Manager | SaaS & Mobile',
            bio: 'Building products that users love. 7+ years in tech.',
            location: 'New York, NY',
            openToWork: true,
            profileScore: 78,
          },
        },
        settings: {
          create: {
            enableAISuggestions: true,
            preferredJobTypes: ['JOB'],
            preferredWorkModes: ['HYBRID'],
            preferredIndustries: ['Technology', 'Finance'],
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'carol@example.com',
        passwordHash: hashPassword('password123'),
        accountType: AccountType.INDIVIDUAL,
        verificationStatus: VerificationStatus.VERIFIED,
        verificationBadge: VerificationBadge.INDIVIDUAL_VERIFIED,
        profile: {
          create: {
            headline: 'UX/UI Designer | Design Systems',
            bio: 'Creating beautiful and functional user experiences.',
            location: 'Austin, TX',
            openToWork: true,
            profileScore: 72,
          },
        },
        settings: {
          create: {
            enableAISuggestions: true,
            preferredJobTypes: ['JOB', 'FREELANCE'],
            preferredWorkModes: ['ONLINE'],
            preferredIndustries: ['Technology', 'Design'],
          },
        },
      },
    }),
  ]);

  // Create student users
  console.log('🎓 Creating student users...');
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'student1@example.com',
        passwordHash: hashPassword('password123'),
        accountType: AccountType.STUDENT,
        verificationStatus: VerificationStatus.VERIFIED,
        verificationBadge: VerificationBadge.INDIVIDUAL_VERIFIED,
        profile: {
          create: {
            headline: 'Computer Science Student | Seeking Internship',
            bio: 'Passionate about web development and open source.',
            location: 'Berkeley, CA',
            openToWork: true,
            profileScore: 65,
          },
        },
        settings: {
          create: {
            enableAISuggestions: true,
            preferredJobTypes: ['INTERNSHIP'],
            preferredWorkModes: ['ONLINE', 'HYBRID'],
            preferredIndustries: ['Technology', 'Startups'],
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'student2@example.com',
        passwordHash: hashPassword('password123'),
        accountType: AccountType.STUDENT,
        verificationStatus: VerificationStatus.VERIFIED,
        verificationBadge: VerificationBadge.INDIVIDUAL_VERIFIED,
        profile: {
          create: {
            headline: 'Business Student | Interested in Product & Strategy',
            bio: 'Exploring careers in tech and business.',
            location: 'Stanford, CA',
            openToWork: true,
            profileScore: 60,
          },
        },
        settings: {
          create: {
            enableAISuggestions: true,
            preferredJobTypes: ['INTERNSHIP'],
            preferredWorkModes: ['HYBRID'],
            preferredIndustries: ['Technology', 'Finance'],
          },
        },
      },
    }),
  ]);

  // Create company users (job givers)
  console.log('🏢 Creating company users...');
  const companies = await Promise.all([
    prisma.user.create({
      data: {
        email: 'hr@techcorp.com',
        passwordHash: hashPassword('password123'),
        accountType: AccountType.COMPANY,
        verificationStatus: VerificationStatus.VERIFIED,
        verificationBadge: VerificationBadge.COMPANY_VERIFIED,
        profile: {
          create: {
            headline: 'TechCorp - Hiring Engineers',
            bio: 'Leading technology company building innovative solutions.',
            location: 'San Francisco, CA',
            activelyHiring: true,
            profileScore: 90,
          },
        },
        settings: {
          create: {
            enableAISuggestions: true,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'hr@startup.io',
        passwordHash: hashPassword('password123'),
        accountType: AccountType.COMPANY,
        verificationStatus: VerificationStatus.VERIFIED,
        verificationBadge: VerificationBadge.STARTUP_VERIFIED,
        profile: {
          create: {
            headline: 'StartupIO - We are Hiring!',
            bio: 'Fast-growing startup in the AI space.',
            location: 'San Francisco, CA',
            activelyHiring: true,
            profileScore: 88,
          },
        },
        settings: {
          create: {
            enableAISuggestions: true,
          },
        },
      },
    }),
  ]);

  // Create startups
  console.log('🚀 Creating startups...');
  const startups = await Promise.all([
    prisma.startup.create({
      data: {
        companyId: companies[1].id,
        name: 'StartupIO',
        tagline: 'AI-powered automation platform',
        tier: StartupTier.MID_LEVEL,
        foundedYear: 2021,
        hqLocation: 'San Francisco, CA',
        teamSize: '50-100',
        industry: ['AI', 'SaaS'],
        techStack: ['Python', 'React', 'PostgreSQL', 'Kubernetes'],
        whyJoinUs: 'Join a fast-growing team working on cutting-edge AI technology. We offer competitive salaries, equity, and a great culture.',
        fundingStage: 'Series A',
        totalRaised: '$5M',
        website: 'https://startup.io',
        culturePerks: ['Remote-friendly', 'Equity offered', 'Flexible hours', 'Health insurance'],
        verifiedAt: new Date(),
      },
    }),
    prisma.startup.create({
      data: {
        companyId: companies[0].id,
        name: 'TechCorp',
        tagline: 'Enterprise software solutions',
        tier: StartupTier.UNICORN,
        foundedYear: 2010,
        hqLocation: 'San Francisco, CA',
        teamSize: '500+',
        industry: ['Enterprise', 'SaaS'],
        techStack: ['Java', 'React', 'PostgreSQL', 'AWS'],
        whyJoinUs: 'Work with the best engineers in the industry on products used by millions.',
        fundingStage: 'Public',
        totalRaised: '$500M+',
        website: 'https://techcorp.com',
        culturePerks: ['Remote-friendly', 'Equity offered', 'Flexible hours', 'Health insurance', '401k'],
        verifiedAt: new Date(),
      },
    }),
  ]);

  // Create skills
  console.log('💡 Creating skills...');
  const skillNames = ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Python', 'UI Design', 'Product Management'];
  
  // Add skills to Alice's profile
  for (const skillName of ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker']) {
    await prisma.skill.create({
      data: {
        profileId: individuals[0].profile!.id,
        name: skillName,
        proficiencyLevel: ProficiencyLevel.EXPERT,
        endorsements: Math.floor(Math.random() * 20),
      },
    });
  }

  // Add skills to Bob's profile
  for (const skillName of ['Product Management', 'SaaS', 'Analytics', 'User Research']) {
    await prisma.skill.create({
      data: {
        profileId: individuals[1].profile!.id,
        name: skillName,
        proficiencyLevel: ProficiencyLevel.EXPERT,
        endorsements: Math.floor(Math.random() * 15),
      },
    });
  }

  // Create certifications
  console.log('🎖️  Creating certifications...');
  await prisma.certification.create({
    data: {
      userId: individuals[0].id,
      name: 'AWS Certified Solutions Architect',
      issuingBody: 'Amazon Web Services',
      issueDate: new Date('2023-01-15'),
      expiryDate: new Date('2025-01-15'),
      credentialId: 'AWS-123456',
      verificationUrl: 'https://aws.amazon.com/verify',
      description: 'Professional level certification for AWS architecture.',
      scanStatus: 'CLEAN',
    },
  });

  // Create experiences
  console.log('💼 Creating experiences...');
  await prisma.experience.create({
    data: {
      profileId: individuals[0].profile!.id,
      title: 'Senior Full Stack Developer',
      company: 'TechCorp',
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      location: 'San Francisco, CA',
      startDate: new Date('2020-01-01'),
      currentlyWorking: true,
      description: 'Led development of core platform features using React and Node.js.',
    },
  });

  // Create job listings
  console.log('📋 Creating job listings...');
  const jobs = await Promise.all([
    prisma.jobListing.create({
      data: {
        giverId: companies[0].id,
        startupId: startups[1].id,
        title: 'Senior React Developer',
        type: JobListingType.JOB,
        workMode: WorkMode.HYBRID,
        location: 'San Francisco, CA',
        salaryMin: 150000,
        salaryMax: 200000,
        experienceYears: 5,
        experienceLevel: ExperienceLevel.SENIOR,
        description: 'We are looking for an experienced React developer to join our team.',
        perksAndBenefits: 'Competitive salary, equity, health insurance, 401k',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        openings: 2,
        status: 'ACTIVE',
      },
    }),
    prisma.jobListing.create({
      data: {
        giverId: companies[1].id,
        startupId: startups[0].id,
        title: 'AI/ML Engineer',
        type: JobListingType.JOB,
        workMode: WorkMode.ONLINE,
        salaryMin: 120000,
        salaryMax: 160000,
        experienceYears: 3,
        experienceLevel: ExperienceLevel.MID,
        description: 'Join our AI team to build the next generation of automation tools.',
        perksAndBenefits: 'Competitive salary, equity, remote work, learning budget',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        openings: 3,
        status: 'ACTIVE',
      },
    }),
    prisma.jobListing.create({
      data: {
        giverId: companies[1].id,
        startupId: startups[0].id,
        title: 'Product Manager Internship',
        type: JobListingType.INTERNSHIP,
        workMode: WorkMode.HYBRID,
        location: 'San Francisco, CA',
        salaryMin: 25,
        salaryMax: 35,
        experienceYears: 0,
        experienceLevel: ExperienceLevel.ENTRY,
        description: 'Great opportunity for students to learn product management.',
        perksAndBenefits: 'Hourly stipend, mentorship, flexible hours',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        openings: 2,
        status: 'ACTIVE',
      },
    }),
  ]);

  // Create applications
  console.log('📝 Creating applications...');
  await prisma.application.create({
    data: {
      listingId: jobs[0].id,
      seekerId: individuals[0].id,
      status: 'APPLIED',
      coverLetter: 'I am very interested in this position and believe my experience is a great fit.',
    },
  });

  // Create connections
  console.log('🤝 Creating connections...');
  await prisma.connection.create({
    data: {
      requesterId: individuals[0].id,
      targetId: individuals[1].id,
      status: 'ACCEPTED',
    },
  });

  // Create posts
  console.log('📢 Creating posts...');
  await prisma.post.create({
    data: {
      authorId: individuals[0].id,
      type: 'TEXT',
      content: 'Excited to announce that I just completed my AWS certification! 🎉',
    },
  });

  console.log('\n✅ Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${individuals.length + students.length} Individual users created`);
  console.log(`   - ${companies.length} Company users created`);
  console.log(`   - ${startups.length} Startups created`);
  console.log(`   - ${jobs.length} Job listings created`);
  console.log('\n🔐 Test Credentials:');
  console.log('   Individual: alice@example.com / password123');
  console.log('   Company: hr@techcorp.com / password123');
  console.log('   Startup: hr@startup.io / password123');
  console.log('   Student: student1@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
