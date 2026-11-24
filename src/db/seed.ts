import { count } from 'drizzle-orm';
import { db } from './index.ts';
import {
  focusAreas,
  galleryItems,
  impactStats,
  programmes,
  projects,
  resources,
  siteSettings,
} from './schema.ts';

const IMG_EDUCATION = '/src/assets/images/hero_tribal_education_odisha_1795521868080.jpg';
const IMG_WOMEN = '/src/assets/images/hero_women_shg_odisha_1795521867788.jpg';
const IMG_FARMING = '/src/assets/images/hero_natural_farming_rayagada_1795521868372.jpg';
const IMG_SKILLS = '/src/assets/images/focus_skill_youth_odisha_1795521868592.jpg';
const IMG_HEALTH = '/src/assets/images/focus_health_nutrition_village_1795521869483.jpg';
const IMG_ENVIRONMENT = '/src/assets/images/focus_environment_plantation_odisha_1795521870165.jpg';

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (seedPromise) {
    return seedPromise;
  }

  seedPromise = (async () => {
    try {
      const existingSettings = await db.select({ value: count() }).from(siteSettings);
      if (Number(existingSettings[0]?.value ?? 0) === 0) {
        const heroSlides = [
          {
            id: 'slide-1',
            title: 'Together for Inclusive and Sustainable Growth',
            subtitle:
              'Empowering marginalized communities through education, livelihood opportunities, skill development, health, environmental sustainability and community participation.',
            imageUrl: IMG_EDUCATION,
            locationLabel: 'Rayagada District, Odisha',
          },
          {
            id: 'slide-2',
            title: 'Strengthening Women Self Help Groups & Rural Livelihoods',
            subtitle:
              'Building collective leadership, financial literacy, and dignified micro-enterprises among rural and tribal women across Kenduguda and Rayagada.',
            imageUrl: IMG_WOMEN,
            locationLabel: 'Women Empowerment & SHGs',
          },
          {
            id: 'slide-3',
            title: 'Promoting Natural Farming & Climate-Resilient Agriculture',
            subtitle:
              'Supporting smallholder and tribal farmers with sustainable millet farming, kitchen gardens, and community-led watershed and plantation stewardship.',
            imageUrl: IMG_FARMING,
            locationLabel: 'Sustainable Agriculture, Eastern Ghats',
          },
        ];

        const aboutSections = {
          organization: {
            title: 'About the Organization',
            summary:
              'Saraswati Educational Trust is a registered non-profit organization established in December 2020 with a commitment to promoting inclusive and sustainable development among marginalized and underserved communities.',
            body:
              'Registered under the Indian Trust Act, 1882 (Registration No. 1602001948), Saraswati Educational Trust operates from Kenduguda, Rayagada, Odisha. The organization primarily works with Scheduled Tribes, Scheduled Castes, women, children, youth, persons with disabilities, and economically weaker families in rural and tribal regions of Rayagada.\n\nOur interventions focus on addressing poverty, inequality, and social exclusion through foundational and English-medium education, youth skill development, sustainable livelihood promotion, women self-help group strengthening, healthcare and sanitation awareness, environmental conservation, and social inclusion.\n\nWe believe that sustainable development can only be achieved when communities actively participate in identifying their needs, developing solutions, and building their own future.',
          },
          profile: {
            title: 'Organization Profile',
            legalName: 'Saraswati Educational Trust',
            established: 'December 2020',
            legalStatus: 'Registered Non-Profit Trust under the Indian Trust Act, 1882',
            headOffice: 'Main Road Hatapada, Kenduguda, Rayagada, Odisha – 765025, India',
            registrationNumber: '1602001948',
            pan: 'ABBTS6380F',
            tan: 'BBNS14859F',
            csr1: 'CSR00073592',
            ngoDarpan: 'OR/2021/0295488',
            reg12A: 'ABBTS6380FE20241',
            reg80G: 'ABBTS6380FF20241',
            udyam: 'UDYAM-OD-27-0005000',
            bankName: 'DCB Bank Limited',
            bankBranch: 'Khaliguda (247) Branch, Khaliguda – 765001',
            bankAccountNo: '24713600000198',
            bankIfsc: 'DCBL0000247',
          },
          visionMission: {
            title: 'Vision, Mission and Core Values',
            vision:
              'To build an inclusive, educated, empowered and sustainable society where every individual has equal opportunities, dignity and access to essential resources.',
            mission:
              'To empower marginalized and underserved communities through quality education, skill development, sustainable livelihoods, environmental conservation, healthcare awareness and community-led development.',
            values: [
              'Equality and Inclusion',
              'Transparency and Accountability',
              'Community Participation',
              'Sustainability',
              'Empowerment',
              'Integrity',
              'Human Dignity',
            ],
          },
          objectives: {
            title: 'Our Objectives',
            items: [
              'Ensure equitable access to quality early childhood and school education for children from Scheduled Tribe, Scheduled Caste, and economically vulnerable households.',
              'Prevent school dropouts through community mobilization, Back to School bridges, and essential school kit support.',
              'Equip rural youth and women with practical vocational, digital, and entrepreneurship skills for dignified employment.',
              'Strengthen Women Self Help Groups (SHGs) through financial literacy, leadership training, and collective livelihood enterprises.',
              'Promote natural farming, indigenous seed conservation, and nutrition kitchen gardens to enhance food security and farmer incomes.',
              'Foster preventive healthcare, maternal and child nutrition, safe drinking water, and sanitation awareness at the village level.',
              'Protect local ecosystems through community-led afforestation, soil and water conservation, and climate resilience education.',
              'Uphold child rights, safeguarding, and full inclusion of persons with disabilities across all community programmes.',
            ],
          },
          approach: {
            title: 'Our Approach',
            body:
              'Saraswati Educational Trust follows a participatory, community-first development model. Every intervention begins with village-level consultations involving Gram Sabhas, parents, women collectives, farmers, and youth groups.\n\nRather than delivering top-down welfare, we build local capacities, strengthen community institutions such as School Management Committees and Women Self Help Groups, and partner with public systems, CSR foundations, and academic institutions for long-term sustainability and measurable accountability.',
          },
          geographicalCoverage: {
            title: 'Geographical Coverage',
            body:
              'Headquartered at Main Road Hatapada, Kenduguda in Rayagada district, Odisha, our operational footprint focuses on rural and tribal blocks across Rayagada and adjoining areas of southern Odisha.\n\nRayagada is predominantly agrarian and home to diverse indigenous communities living across the Eastern Ghats terrain, where geographical remoteness often limits access to quality schooling, healthcare awareness, and formal livelihood markets.',
            regions: [
              'Kenduguda & Khaliguda Gram Panchayats, Rayagada',
              'Rural & Tribal Blocks across Rayagada District, Odisha',
              'Adjoining underserved habitations in Southern Odisha',
            ],
          },
          secretaryMessage: {
            title: "Secretary's Message",
            body:
              'When Saraswati Educational Trust was established in December 2020 in Kenduguda, Rayagada, our guiding conviction was simple: lasting change grows from within the community. Across the villages of Rayagada, we witness extraordinary resilience among tribal families, women collectives, smallholder farmers, and first-generation learners.\n\nOur role is to stand alongside them—expanding access to quality education through Bright Kids English Medium School and our Back to School initiatives, nurturing sustainable natural farming, strengthening Women SHGs, and creating pathways for youth skills and community health.\n\nWe remain deeply committed to transparency, statutory compliance, and collaborative partnerships with donors, CSR leaders, and government institutions as we work together for inclusive and sustainable growth.',
            signatoryTitle: 'Office of the Secretary, Saraswati Educational Trust',
          },
          challengesCommitment: {
            title: 'Challenges and Our Commitment',
            body:
              'Working in remote tribal and rural belts of Rayagada presents structural challenges including seasonal migration, language and distance barriers in schooling, climate vulnerability affecting rain-fed agriculture, limited digital literacy, and inadequate access to preventive health and disability support services.\n\nOur commitment is steadfast: to maintain year-round grassroots presence, publish transparent documentation of every programme, uphold zero-tolerance child protection and safeguarding standards, and co-create resilient community institutions that thrive independently.',
          },
        };

        const contactInfo = {
          organizationName: 'Saraswati Educational Trust',
          address: 'Main Road Hatapada, Kenduguda, Rayagada, Odisha – 765025, India',
          phone: '+91 9777110362',
          whatsapp: '919777110362',
          email: 'secratary@saraswatiedutrust.online',
          website: 'www.saraswatiedutrust.online',
          latitude: 19.1712,
          longitude: 83.4165,
          officeHours: 'Monday – Saturday, 9:30 AM – 5:30 PM IST',
          facebookUrl: '',
          linkedinUrl: '',
          youtubeUrl: '',
          instagramUrl: '',
        };

        const seoSettings = {
          siteTitle: 'Saraswati Educational Trust – Rayagada, Odisha | Official NGO',
          metaDescription:
            'Saraswati Educational Trust empowers marginalized and tribal communities in Rayagada, Odisha through education, livelihoods, natural farming, health, and inclusion.',
          keywords:
            'Saraswati Educational Trust, Rayagada NGO, Odisha NGO, Tribal Education, Women SHG, Natural Farming Odisha, CSR Partner India, 80G 12A CSR-1 NGO',
        };

        await db.insert(siteSettings).values([
          { key: 'hero_slides', value: JSON.stringify(heroSlides) },
          { key: 'about_sections', value: JSON.stringify(aboutSections) },
          { key: 'contact_info', value: JSON.stringify(contactInfo) },
          { key: 'seo_settings', value: JSON.stringify(seoSettings) },
        ]);
      }

      const existingStats = await db.select({ value: count() }).from(impactStats);
      if (Number(existingStats[0]?.value ?? 0) === 0) {
        await db.insert(impactStats).values([
          { slug: 'children-reached', label: 'Children Reached', value: 0, unit: '+', verificationNote: 'Organizational Records (Editable in CMS)', sortOrder: 1 },
          { slug: 'students-supported', label: 'Students Supported', value: 0, unit: '+', verificationNote: 'Organizational Records (Editable in CMS)', sortOrder: 2 },
          { slug: 'women-empowered', label: 'Women Empowered', value: 0, unit: '+', verificationNote: 'Organizational Records (Editable in CMS)', sortOrder: 3 },
          { slug: 'farmers-supported', label: 'Farmers Supported', value: 0, unit: '+', verificationNote: 'Organizational Records (Editable in CMS)', sortOrder: 4 },
          { slug: 'youth-trained', label: 'Youth Trained', value: 0, unit: '+', verificationNote: 'Organizational Records (Editable in CMS)', sortOrder: 5 },
          { slug: 'villages-covered', label: 'Villages Covered', value: 0, unit: '', verificationNote: 'Organizational Records (Editable in CMS)', sortOrder: 6 },
          { slug: 'community-programmes', label: 'Community Programmes', value: 0, unit: '', verificationNote: 'Organizational Records (Editable in CMS)', sortOrder: 7 },
          { slug: 'environmental-activities', label: 'Environmental Activities', value: 0, unit: '', verificationNote: 'Organizational Records (Editable in CMS)', sortOrder: 8 },
        ]);
      }

      const existingFocus = await db.select({ value: count() }).from(focusAreas);
      if (Number(existingFocus[0]?.value ?? 0) === 0) {
        await db.insert(focusAreas).values([
          {
            slug: 'education-and-child-development',
            title: 'Education and Child Development',
            shortDescription: 'Foundational literacy, English-medium schooling, school kits, and dropout prevention for rural and tribal children.',
            fullDescription: 'Ensuring every child in Rayagada has access to welcoming classrooms, learning materials, bridge coaching, and holistic child development through Bright Kids English Medium School and community learning drives.',
            imageUrl: IMG_EDUCATION,
            sortOrder: 1,
          },
          {
            slug: 'skill-development-and-youth-empowerment',
            title: 'Skill Development and Youth Empowerment',
            shortDescription: 'Vocational training, digital literacy, and employment readiness for rural young women and men.',
            fullDescription: 'Equipping out-of-school and college youth with practical market-linked skills including tailoring, computer fundamentals, enterprise management, and career guidance.',
            imageUrl: IMG_SKILLS,
            sortOrder: 2,
          },
          {
            slug: 'women-empowerment-and-shg-development',
            title: 'Women Empowerment and SHG Development',
            shortDescription: 'Strengthening Women Self Help Groups with financial literacy, leadership, and micro-enterprise support.',
            fullDescription: 'Organizing and mentoring rural women collectives around savings, bookkeeping, value-added craft and food enterprises, and civic participation.',
            imageUrl: IMG_WOMEN,
            sortOrder: 3,
          },
          {
            slug: 'sustainable-agriculture-and-natural-farming',
            title: 'Sustainable Agriculture and Natural Farming',
            shortDescription: 'Chemical-free farming, indigenous millet cultivation, seed banks, and nutrition kitchen gardens.',
            fullDescription: 'Training tribal smallholder farmers in soil health, bio-inputs, multi-cropping, and household nutrition gardens to boost resilience and reduce cultivation costs.',
            imageUrl: IMG_FARMING,
            sortOrder: 4,
          },
          {
            slug: 'livelihood-promotion-and-economic-development',
            title: 'Livelihood Promotion and Economic Development',
            shortDescription: 'Diversified rural livelihoods, micro-business mentoring, and fair market linkages for vulnerable families.',
            fullDescription: 'Supporting economically weaker households to build resilient farm and non-farm income streams through collective enterprise and value-chain linkages.',
            imageUrl: IMG_WOMEN,
            sortOrder: 5,
          },
          {
            slug: 'health-nutrition-and-sanitation',
            title: 'Health, Nutrition and Sanitation',
            shortDescription: 'Village health camps, maternal and child nutrition awareness, safe water, and WASH practices.',
            fullDescription: 'Partnering with communities to improve preventive healthcare awareness, hygiene practices, menstrual health, and balanced household nutrition.',
            imageUrl: IMG_HEALTH,
            sortOrder: 6,
          },
          {
            slug: 'environmental-protection-and-climate-resilience',
            title: 'Environmental Protection and Climate Resilience',
            shortDescription: 'Native tree plantation, biodiversity protection, plastic-free village drives, and water conservation.',
            fullDescription: 'Mobilizing schools and villages across the Eastern Ghats for sapling plantation, watershed awareness, and community climate adaptation.',
            imageUrl: IMG_ENVIRONMENT,
            sortOrder: 7,
          },
          {
            slug: 'tribal-and-community-development',
            title: 'Tribal and Community Development',
            shortDescription: 'Culturally respectful grassroots engagement strengthening Gram Sabhas and local entitlements.',
            fullDescription: 'Facilitating community mobilization, access to public welfare schemes, and participatory village development planning in tribal habitations.',
            imageUrl: IMG_FARMING,
            sortOrder: 8,
          },
          {
            slug: 'child-rights-and-social-protection',
            title: 'Child Rights and Social Protection',
            shortDescription: 'Safe childhood advocacy, child protection committees, and prevention of child labour and early marriage.',
            fullDescription: 'Enforcing child safeguarding awareness with parents, teachers, and village leaders so every child learns and grows in dignity and safety.',
            imageUrl: IMG_EDUCATION,
            sortOrder: 9,
          },
          {
            slug: 'disability-inclusion-and-equal-opportunities',
            title: 'Disability Inclusion and Equal Opportunities',
            shortDescription: 'Accessible education, assistive support linkages, and barrier-free community participation.',
            fullDescription: 'Championing dignity, inclusive classrooms, livelihood inclusion, and social entitlement access for persons with disabilities in rural Rayagada.',
            imageUrl: IMG_SKILLS,
            sortOrder: 10,
          },
        ]);
      }

      const existingProgrammes = await db.select({ value: count() }).from(programmes);
      if (Number(existingProgrammes[0]?.value ?? 0) === 0) {
        await db.insert(programmes).values([
          {
            slug: 'back-to-school-initiative',
            title: 'Back to School Initiative',
            focusAreaSlug: 'education-and-child-development',
            location: 'Rural & Tribal Villages, Rayagada, Odisha',
            beneficiaries: 'Out-of-school and dropout-prone children from ST, SC, and migrant families',
            objectives: 'Identify out-of-school children, provide bridge learning readiness, and re-enroll them into age-appropriate formal schooling.',
            activities: 'Door-to-door household surveys, parent counselling, bridge remedial sessions, and school enrollment drives with local teachers.',
            outcomes: 'Strengthened school retention and active community ownership over children’s regular attendance.',
            imageUrl: IMG_EDUCATION,
          },
          {
            slug: 'school-kit-distribution',
            title: 'School Kit Distribution',
            focusAreaSlug: 'education-and-child-development',
            location: 'Kenduguda & Surrounding Gram Panchayats, Rayagada',
            beneficiaries: 'Economically weaker and first-generation school students',
            objectives: 'Reduce family financial barriers to schooling by supplying essential learning kits at the start of academic terms.',
            activities: 'Distribution of school bags, notebooks, textbooks, geometry boxes, slates, and stationery kits in community ceremonies.',
            outcomes: 'Improved student readiness, classroom participation, and relief for low-income families.',
            imageUrl: IMG_EDUCATION,
          },
          {
            slug: 'educational-support-for-poor-children',
            title: 'Educational Support for Poor Children',
            focusAreaSlug: 'education-and-child-development',
            location: 'Rayagada District, Odisha',
            beneficiaries: 'Children from single-parent, daily-wage, and marginalized households',
            objectives: 'Provide sustained academic mentorship, after-school remedial tutoring, and material support so financial hardship never halts learning.',
            activities: 'Evening learning centres, foundational numeracy and literacy coaching, and periodic parent-teacher progress reviews.',
            outcomes: 'Stronger foundational reading and mathematics fluency among primary and upper-primary learners.',
            imageUrl: IMG_EDUCATION,
          },
          {
            slug: 'bright-kids-english-medium-school',
            title: 'Bright Kids English Medium School',
            focusAreaSlug: 'education-and-child-development',
            location: 'Kenduguda, Rayagada, Odisha',
            beneficiaries: 'Rural and tribal children seeking quality English-medium foundational education',
            objectives: 'Deliver joyful, value-based, inclusive English-medium schooling rooted in local culture at accessible community fees and scholarship support.',
            activities: 'Activity-based classroom learning, co-curricular arts and sports, life-skills education, and inclusive learning support.',
            outcomes: 'Confident young learners equipped with strong bilingual fluency and foundational academic skills.',
            imageUrl: IMG_EDUCATION,
          },
          {
            slug: 'natural-farming-promotion',
            title: 'Natural Farming Promotion',
            focusAreaSlug: 'sustainable-agriculture-and-natural-farming',
            location: 'Rayagada Hills & Adjoining Villages, Odisha',
            beneficiaries: 'Smallholder and tribal farming households',
            objectives: 'Transition village agriculture away from costly chemical inputs toward eco-friendly natural farming and soil regeneration.',
            activities: 'Preparation of Jeevamrut, Beejamrut, organic composting, mulching demonstrations, and indigenous millet promotion.',
            outcomes: 'Lower input expenses for farmers, healthier soil biodiversity, and chemical-free family harvests.',
            imageUrl: IMG_FARMING,
          },
          {
            slug: 'farmer-training-and-demonstrations',
            title: 'Farmer Training and Demonstrations',
            focusAreaSlug: 'sustainable-agriculture-and-natural-farming',
            location: 'Cluster Demonstration Plots, Rayagada District',
            beneficiaries: 'Marginal farmers and women cultivators',
            objectives: 'Build practical agronomic knowledge through hands-on field demonstrations and seasonal crop planning.',
            activities: 'Field schools, seed treatment workshops, integrated pest management, and seasonal crop diversification training.',
            outcomes: 'Practical adoption of climate-resilient cultivation methods across participating farmer groups.',
            imageUrl: IMG_FARMING,
          },
          {
            slug: 'women-self-help-group-development',
            title: 'Women Self Help Group Development',
            focusAreaSlug: 'women-empowerment-and-shg-development',
            location: 'Kenduguda & Rural Rayagada Clusters',
            beneficiaries: 'Rural, tribal, and economically disadvantaged women',
            objectives: 'Form and strengthen self-reliant Women SHGs for collective thrift, credit linkage, and income-generating enterprises.',
            activities: 'SHG bookkeeping workshops, bank linkage facilitation, leadership orientation, and collective enterprise mentoring.',
            outcomes: 'Enhanced household financial decision-making and sustainable collective income pathways for women members.',
            imageUrl: IMG_WOMEN,
          },
          {
            slug: 'youth-skill-training',
            title: 'Youth Skill Training',
            focusAreaSlug: 'skill-development-and-youth-empowerment',
            location: 'Kenduguda Community Training Centre, Rayagada',
            beneficiaries: 'Unemployed rural youth and young women',
            objectives: 'Bridge the rural employability gap through structured vocational training, digital literacy, and self-employment support.',
            activities: 'Hands-on tailoring and garment making, basic computer applications, entrepreneurship orientation, and placement guidance.',
            outcomes: 'Trained youth gaining confidence to launch local micro-enterprises or access skilled employment.',
            imageUrl: IMG_SKILLS,
          },
          {
            slug: 'kitchen-garden-promotion',
            title: 'Kitchen Garden Promotion',
            focusAreaSlug: 'health-nutrition-and-sanitation',
            location: 'Tribal & Rural Households, Rayagada',
            beneficiaries: 'Rural families, expectant mothers, and young children',
            objectives: 'Ensure daily household availability of fresh, pesticide-free seasonal vegetables and greens to combat malnutrition.',
            activities: 'Distribution of indigenous vegetable seed kits, organic bed preparation training, and greywater reuse demonstrations.',
            outcomes: 'Improved dietary diversity at the household level and reduced dependency on market vegetable purchases.',
            imageUrl: IMG_FARMING,
          },
          {
            slug: 'plantation-and-environmental-awareness',
            title: 'Plantation and Environmental Awareness',
            focusAreaSlug: 'environmental-protection-and-climate-resilience',
            location: 'Schools, Village Commons & Roadsides, Rayagada',
            beneficiaries: 'Students, youth volunteers, and Gram Sabha communities',
            objectives: 'Restore native green cover and instill environmental stewardship across rural schools and villages.',
            activities: 'Monsoon native sapling drives, tree guard installation, school eco-club sessions, and plastic waste awareness campaigns.',
            outcomes: 'Growing community green belts and active student participation in protecting local biodiversity.',
            imageUrl: IMG_ENVIRONMENT,
          },
          {
            slug: 'health-and-sanitation-awareness',
            title: 'Health and Sanitation Awareness',
            focusAreaSlug: 'health-nutrition-and-sanitation',
            location: 'Kenduguda & Tribal Habitations, Rayagada',
            beneficiaries: 'Women, adolescents, children, and elderly residents',
            objectives: 'Promote preventive health behaviours, menstrual hygiene, safe drinking water handling, and village cleanliness.',
            activities: 'Village health dialogues, nutrition demonstrations, handwashing workshops in schools, and sanitation drives.',
            outcomes: 'Stronger community awareness on nutrition, hygiene, and timely preventive healthcare linkages.',
            imageUrl: IMG_HEALTH,
          },
          {
            slug: 'community-mobilisation',
            title: 'Community Mobilisation',
            focusAreaSlug: 'tribal-and-community-development',
            location: 'Rayagada District, Odisha',
            beneficiaries: 'Marginalized rural and tribal communities, persons with disabilities',
            objectives: 'Foster participatory grassroots leadership and awareness of social welfare, education, and disability entitlements.',
            activities: 'Village meetings, participatory rural appraisals, Gram Sabha strengthening, and inclusive awareness campaigns.',
            outcomes: 'Empowered communities actively prioritizing and co-managing local development initiatives.',
            imageUrl: IMG_WOMEN,
          },
        ]);
      }

      const existingProjects = await db.select({ value: count() }).from(projects);
      if (Number(existingProjects[0]?.value ?? 0) === 0) {
        await db.insert(projects).values([
          {
            slug: 'bright-kids-inclusive-learning-rayagada',
            title: 'Bright Kids & Community Bridge Learning Initiative',
            category: 'Education',
            location: 'Kenduguda & Adjoining Villages, Rayagada, Odisha',
            duration: 'Ongoing (Since 2021)',
            status: 'Active',
            targetBeneficiaries: 'Children from Scheduled Tribe, Scheduled Caste, and economically weaker rural households',
            overview: 'A comprehensive educational initiative combining Bright Kids English Medium School with village-level Back to School mobilization and learning kit support.',
            problemStatement: 'Rural and tribal children in remote habitations of Rayagada face barriers including irregular foundational instruction, lack of learning materials, and seasonal dropout risks.',
            objectives: 'Provide welcoming foundational education, supply essential learning kits, and re-integrate out-of-school children into continuous learning.',
            activities: 'Daily classroom instruction, remedial bridge classes, school kit distribution, and quarterly parent engagement meetings.',
            outputsOutcomes: 'Consistent classroom engagement, stronger bilingual literacy, and active family commitment to children’s education.',
            budgetDisclosed: 'Available on CSR / Donor Request',
            imageUrl: IMG_EDUCATION,
          },
          {
            slug: 'sustainable-natural-farming-kitchen-gardens',
            title: 'Climate-Resilient Natural Farming & Nutrition Kitchen Gardens',
            category: 'Agriculture',
            location: 'Rural & Tribal Clusters, Rayagada District, Odisha',
            duration: 'Ongoing',
            status: 'Active',
            targetBeneficiaries: 'Smallholder tribal farmers and rural women-led households',
            overview: 'Strengthening local food and nutrition security by equipping farming families with chemical-free cultivation practices and homestead vegetable gardens.',
            problemStatement: 'Rising chemical input costs, erratic rainfall, and limited dietary diversity impact both farm livelihoods and household nutrition.',
            objectives: 'Promote low-cost natural farming inputs, millet conservation, and year-round homestead vegetable cultivation.',
            activities: 'On-field farmer demonstrations, organic bio-input workshops, seed kit support, and nutrition literacy sessions.',
            outputsOutcomes: 'Reduced agricultural input expenditure and steady household availability of fresh chemical-free produce.',
            budgetDisclosed: 'Available on CSR / Donor Request',
            imageUrl: IMG_FARMING,
          },
          {
            slug: 'women-shg-livelihood-skill-mission',
            title: 'Women SHG Collective Livelihood & Youth Skill Mission',
            category: 'Women Empowerment',
            location: 'Kenduguda & Khaliguda Panchayats, Rayagada',
            duration: 'Ongoing',
            status: 'Active',
            targetBeneficiaries: 'Rural women SHG members and unemployed youth',
            overview: 'Building sustainable rural livelihoods through Women Self Help Group capacity building, vocational tailoring, and basic digital skill training.',
            problemStatement: 'Limited local employment avenues and lack of formal financial and market linkages restrict economic independence for rural women and youth.',
            objectives: 'Strengthen SHG governance, train youth in market-relevant trades, and facilitate micro-enterprise readiness.',
            activities: 'SHG financial literacy clinics, sewing and tailoring batches, computer literacy modules, and enterprise counselling.',
            outputsOutcomes: 'Enhanced financial literacy within women collectives and practical vocational readiness among youth participants.',
            budgetDisclosed: 'Available on CSR / Donor Request',
            imageUrl: IMG_WOMEN,
          },
          {
            slug: 'village-wash-nutrition-green-resilience',
            title: 'Community WASH, Preventive Health & Green Village Resilience',
            category: 'WASH',
            location: 'Rayagada Block, Odisha',
            duration: 'Ongoing',
            status: 'Active',
            targetBeneficiaries: 'Village communities, school children, and mothers',
            overview: 'An integrated village well-being initiative uniting preventive health and sanitation education with native tree plantation drives.',
            problemStatement: 'Preventable seasonal illnesses, nutrition gaps, and receding local tree cover affect community resilience in rural habitations.',
            objectives: 'Improve hygiene and nutrition behaviours while expanding community green cover around schools and common lands.',
            activities: 'Health and hygiene awareness camps, school handwashing sessions, native sapling plantation, and community clean-up drives.',
            outputsOutcomes: 'Heightened community awareness of preventive WASH practices and active youth stewardship of village plantations.',
            budgetDisclosed: 'Available on CSR / Donor Request',
            imageUrl: IMG_HEALTH,
          },
        ]);
      }

      const existingGallery = await db.select({ value: count() }).from(galleryItems);
      if (Number(existingGallery[0]?.value ?? 0) === 0) {
        await db.insert(galleryItems).values([
          {
            title: 'Village Classroom Learning Session',
            category: 'Education',
            mediaType: 'photo',
            mediaUrl: IMG_EDUCATION,
            caption: 'Students engaging in foundational literacy and numeracy activities in Rayagada, Odisha.',
          },
          {
            title: 'Women Self Help Group Collective Meeting',
            category: 'Women Empowerment',
            mediaType: 'photo',
            mediaUrl: IMG_WOMEN,
            caption: 'SHG members reviewing savings ledgers and planning community micro-enterprises.',
          },
          {
            title: 'Natural Farming & Kitchen Garden Fieldwork',
            category: 'Agriculture',
            mediaType: 'photo',
            mediaUrl: IMG_FARMING,
            caption: 'Tribal farmers cultivating chemical-free vegetables and millet crops in the Eastern Ghats.',
          },
          {
            title: 'Youth Tailoring & Digital Literacy Training',
            category: 'Skill Development',
            mediaType: 'photo',
            mediaUrl: IMG_SKILLS,
            caption: 'Rural youth gaining practical vocational and computer skills at our training centre.',
          },
          {
            title: 'Community Health & Nutrition Awareness Camp',
            category: 'Health and Sanitation',
            mediaType: 'photo',
            mediaUrl: IMG_HEALTH,
            caption: 'Village health and nutrition education session focusing on fresh local greens and hygiene.',
          },
          {
            title: 'Community Native Sapling Plantation Drive',
            category: 'Environment',
            mediaType: 'photo',
            mediaUrl: IMG_ENVIRONMENT,
            caption: 'Students and villagers planting native tree saplings along rural pathways in Rayagada.',
          },
        ]);
      }

      const existingResources = await db.select({ value: count() }).from(resources);
      if (Number(existingResources[0]?.value ?? 0) === 0) {
        await db.insert(resources).values([
          {
            title: 'Trust Registration Certificate (Indian Trust Act, 1882)',
            category: 'Registration Certificates',
            documentNumber: 'Reg. No. 1602001948',
            description: 'Official non-profit trust registration record established in December 2020 in Odisha.',
            isPublic: false,
            accessLevel: 'csr_request',
          },
          {
            title: 'PAN & TAN Statutory Records',
            category: 'PAN and TAN Documents',
            documentNumber: 'PAN: ABBTS6380F · TAN: BBNS14859F',
            description: 'Income Tax Permanent Account Number and Tax Deduction Account Number registrations.',
            isPublic: false,
            accessLevel: 'csr_request',
          },
          {
            title: '12A & 80G Tax Exemption Certificates',
            category: '12A and 80G Certificates',
            documentNumber: '12A: ABBTS6380FE20241 · 80G: ABBTS6380FF20241',
            description: 'Income Tax Act Section 12A and 80G approvals governing charitable exemption and donor eligibility.',
            isPublic: false,
            accessLevel: 'csr_request',
          },
          {
            title: 'MCA CSR-1 Registration Certificate',
            category: 'CSR-1 Certificate',
            documentNumber: 'CSR00073592',
            description: 'Ministry of Corporate Affairs Form CSR-1 eligibility for undertaking CSR-funded development activities.',
            isPublic: false,
            accessLevel: 'csr_request',
          },
          {
            title: 'NITI Aayog NGO Darpan Registration',
            category: 'NGO Darpan Registration',
            documentNumber: 'OR/2021/0295488',
            description: 'Unique ID registration on the Government of India NGO Darpan portal.',
            isPublic: false,
            accessLevel: 'csr_request',
          },
          {
            title: 'Udyam MSME Registration Certificate',
            category: 'Registration Certificates',
            documentNumber: 'UDYAM-OD-27-0005000',
            description: 'Udyam registration record supporting livelihood and micro-enterprise facilitation.',
            isPublic: false,
            accessLevel: 'csr_request',
          },
          {
            title: 'Annual Activity & Financial Reports',
            category: 'Annual Reports',
            documentNumber: 'FY 2020–Present',
            description: 'Annual organizational progress and audited financial statements uploaded by Trust administration.',
            isPublic: false,
            accessLevel: 'public',
          },
          {
            title: 'Programme & Project Evaluation Reports',
            category: 'Project Reports',
            documentNumber: 'Field Documentation',
            description: 'Detailed project implementation reports and donor-approved outcome summaries.',
            isPublic: false,
            accessLevel: 'public',
          },
          {
            title: 'Community Case Studies & Field Briefs',
            category: 'Case Studies',
            documentNumber: 'Rayagada Field Studies',
            description: 'Documented community transformation case studies across education, agriculture, and SHGs.',
            isPublic: false,
            accessLevel: 'public',
          },
          {
            title: 'Research Papers & Rural Development Publications',
            category: 'Research and Publications',
            documentNumber: 'Research Series',
            description: 'Grassroots assessments and learning notes from tribal and rural development programmes.',
            isPublic: false,
            accessLevel: 'public',
          },
          {
            title: 'Trust Quarterly Newsletters',
            category: 'Newsletters',
            documentNumber: 'Community Updates',
            description: 'Periodic updates highlighting community participation, events, and school milestones.',
            isPublic: false,
            accessLevel: 'public',
          },
          {
            title: 'Governance, Child Protection & Safeguarding Policies',
            category: 'Policy Documents',
            documentNumber: 'Institutional Policies',
            description: 'Core organizational policies covering child protection, safeguarding, transparency, and donor accountability.',
            isPublic: false,
            accessLevel: 'public',
          },
          {
            title: 'Saraswati Educational Trust Organizational Brochure',
            category: 'Organizational Brochure',
            documentNumber: 'Institutional Profile',
            description: 'Overview brochure for CSR partners, institutional donors, and community stakeholders.',
            isPublic: false,
            accessLevel: 'public',
          },
        ]);
      }
    } catch (err) {
      seedPromise = null;
      throw err;
    }
  })();

  return seedPromise;
}
