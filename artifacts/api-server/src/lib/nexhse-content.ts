export const services = [
  ['OSH Training', 'Training & Capacity Building', 'Builds core hazard awareness and legal compliance org-wide.'],
  ['Fire Safety Training', 'Training & Capacity Building', 'Prevention, response and evacuation skills, including fire marshals.'],
  ['First Aid Training', 'Training & Capacity Building', 'Certified first aider and refresher training aligned to the 2024 Regulations.'],
  ['Work at Height & Confined Space Training', 'Training & Capacity Building', 'Specialised competence for high-risk access, fall protection and entry.'],
  ['Emergency Response Training', 'Training & Capacity Building', 'Builds organisational readiness to respond to workplace emergencies.'],
  ['Training on Alcohol & Drug Abuse', 'Training & Capacity Building', 'Awareness training and workplace policy support for substance-related risk.'],
  ['PPE Training', 'Training & Capacity Building', 'Correct selection, fitting and use of personal protective equipment.'],
  ['Risk Assessments', 'Assessments, Audits & Policy', 'Identifies and controls workplace hazards before they cause harm.'],
  ['Health & Safety Audits', 'Assessments, Audits & Policy', 'Independent verification against statutory and ISO 45001 standards.'],
  ['Fire Safety Inspections & Audits', 'Assessments, Audits & Policy', 'Verifies fire controls against the Fire Risk Reduction Rules, 2007.'],
  ['Development of OSH Policies', 'Assessments, Audits & Policy', 'Tailored policy frameworks built for your operation.'],
  ['Asbestos Containing Materials Surveys', 'Assessments, Audits & Policy', 'Identification and risk management of legacy asbestos hazards.'],
  ['Chemical & Mechanical Safety', 'Specialised Services', 'Safe handling, storage and operation around hazards and machinery.'],
  ['Disaster Preparedness & Management', 'Specialised Services', 'Structured planning and readiness for large-scale or catastrophic events.'],
  ['Construction Site Safety Management & Monitoring', 'Specialised Services', 'On-site HSE oversight and supervision through the project lifecycle.'],
  ['Firefighting Equipment Supply & Maintenance', 'Equipment Supply', 'Reliable, inspected firefighting equipment supply and upkeep.'],
  ['PPE Supply', 'Equipment Supply', 'Quality PPE supplied alongside the training to use it correctly.'],
  ['First Aid Appliances Supply', 'Equipment Supply', 'Fully stocked, compliant first aid kits and station equipment.'],
  ['Environmental Impact Assessment & Audits', 'Environmental Management', 'Assesses and verifies environmental compliance and impact management.'],
  ['Environmental Education (Training)', 'Environmental Management', 'Builds environmental awareness and responsibility across your workforce.'],
  ['Environmental Policies & Management Plans', 'Environmental Management', 'Structured frameworks that guide consistent environmental performance.'],
  ['Environmental Management Systems', 'Environmental Management', 'Systems-based approach to continual environmental improvement.'],
  ['Waste Management', 'Environmental Management', 'Safe, compliant handling, storage and disposal of waste streams.'],
  ['Effluent & Emissions Management', 'Environmental Management', 'Discharge control planning and monitoring for liquid and airborne emissions.'],
] as const;

const serviceSlugOverrides: Record<string, string> = {
  'Training on Alcohol & Drug Abuse': 'alcohol-drug-abuse-training',
  'Development of OSH Policies': 'osh-policies',
  'Environmental Education (Training)': 'environmental-education-training',
  'Work at Height & Confined Space Training': 'work-at-height-confined-space-training',
  'Health & Safety Audits': 'health-safety-audits',
  'Fire Safety Inspections & Audits': 'fire-safety-inspections-audits',
  'Chemical & Mechanical Safety': 'chemical-mechanical-safety',
  'Construction Site Safety Management & Monitoring': 'construction-site-safety-management-monitoring',
  'Environmental Policies & Management Plans': 'environmental-policies-management-plans',
  'Effluent & Emissions Management': 'effluent-emissions-management',
};

function contentSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getServiceUrl(name: string) {
  const slug = serviceSlugOverrides[name] ?? contentSlug(name);
  return `https://nexhse.co.ke/services/${slug}`;
}

export function getArticleUrl(title: string) {
  return `https://nexhse.co.ke/blog/${contentSlug(title)}`;
}

export const faqs = [
  ['How does NexHSE begin an engagement?', 'We start by understanding your organisation, operating context and the practical concern you need to solve.'],
  ['Can training be delivered at our workplace?', 'Delivery format is shaped around the programme and your organisation.'],
  ['Do you provide quotations?', 'Yes. Request a quote with a few details about your organisation and requirement.'],
  ['What areas of HSE does NexHSE support?', 'NexHSE supports workplace safety, fire safety, training, audits, risk assessment, equipment supply and environmental management.'],
] as const;

export const articles = [
  ['Why risk assessments matter before incidents happen', 'Risk management', 'A practical way to make workplace exposure visible and choose controls before an incident forces the conversation.'],
  ['Building fire-ready workplaces', 'Fire safety', 'Preparedness is prevention, practiced response, clear roles and a building people can evacuate.'],
  ['Training that changes workplace behaviour', 'HSE training', 'The value of training is measured after the classroom, when people apply knowledge to everyday work.'],
  ['Environmental management as operational discipline', 'Environment', 'Environmental performance improves when responsibilities, controls and monitoring are built into planned work.'],
  ['PPE selection that works on site', 'PPE', 'Select protective equipment around the task, hazard, fit and people expected to use it.'],
  ['What a useful safety audit should leave behind', 'Audits', 'An audit creates value when it clarifies priorities, ownership and practical next actions.'],
  ['First aid readiness starts before the injury', 'First aid', 'People, equipment, access and practice must work together before an incident happens.'],
  ['Confined-space planning and the permit to work', 'High-risk work', 'Safe entry depends on risk review, atmospheric awareness, roles and rescue planning.'],
] as const;

export const products = [
  ['Industrial Safety Helmet', 'PPE', 'Certified head protection with comfortable fit for on-site teams and contractors.', 'https://shop.nexhse.co.ke/industrial-safety-helmet'],
  ['Safety Boots', 'PPE', 'Heavy-duty, slip-resistant footwear built for long shifts on active job sites.', 'https://shop.nexhse.co.ke/safety-boots'],
  ['Protective Work Gloves', 'PPE', 'Grip-focused hand protection for handling, maintenance and general site work.', 'https://shop.nexhse.co.ke/protective-work-gloves'],
  ['9kg Fire Extinguisher', 'Fire Equipment', 'A dependable multipurpose extinguisher for facilities and mobile teams.', 'https://shop.nexhse.co.ke/9kg-fire-extinguisher'],
  ['Fire Blanket', 'Fire Equipment', 'Fast protection for kitchen, workshop and emergency response scenarios.', 'https://shop.nexhse.co.ke/fire-blanket'],
  ['PPE Starter Kit', 'PPE', 'A practical combination of essential personal protective equipment for new teams.', 'https://shop.nexhse.co.ke/ppe-starter-kit'],
  ['Fire Safety Drill Kit', 'Fire Equipment', 'Practical equipment support for fire drills and response training.', 'https://shop.nexhse.co.ke/fire-safety-drill-kit'],
  ['Safety Helmet - White', 'PPE', 'Lightweight hard hat for everyday site protection and supervised work.', 'https://shop.nexhse.co.ke/safety-helmet-white'],
  ['Safety Boots - Field', 'PPE', 'Durable protective boots for field teams working across varied terrain.', 'https://shop.nexhse.co.ke/safety-boots-field'],
  ['Safety Boots - Industrial', 'PPE', 'Industrial footwear for demanding work areas and maintenance environments.', 'https://shop.nexhse.co.ke/safety-boots-industrial'],
  ['High-Vis Vest', 'PPE', 'Bright visibility wear for construction, logistics and operational teams.', 'https://shop.nexhse.co.ke/high-vis-vest'],
  ['Eye Protection', 'PPE', 'Protective eyewear for dust, debris and routine workplace hazards.', 'https://shop.nexhse.co.ke/eye-protection'],
  ['Protective Coverall', 'PPE', 'Full-body workwear for teams requiring practical clothing protection.', 'https://shop.nexhse.co.ke/protective-coverall'],
  ['Reflective Safety Strip', 'PPE', 'Portable visibility and hazard marking support for outdoor work areas.', 'https://shop.nexhse.co.ke/reflective-safety-strip'],
  ['12kg Fire Extinguisher', 'Fire Equipment', 'Higher-capacity fire protection for larger operational and storage areas.', 'https://shop.nexhse.co.ke/12kg-fire-extinguisher'],
  ['Fire Extinguisher', 'Fire Equipment', 'Accessible fire response equipment for workplace preparedness.', 'https://shop.nexhse.co.ke/fire-extinguisher'],
  ['Foam Fire Suppression Agent', 'Fire Equipment', 'Fire response support for workplace readiness and emergency preparation.', 'https://shop.nexhse.co.ke/foam-fire-suppression-agent'],
  ['Fire Powder', 'Fire Equipment', 'Dry powder fire suppression support for common workplace fire risks.', 'https://shop.nexhse.co.ke/fire-powder'],
  ['Fire Safety Cabinet', 'Fire Equipment', 'Protective storage and access support for fire response equipment.', 'https://shop.nexhse.co.ke/fire-safety-cabinet'],
  ['Safety Ladder', 'Fire Equipment', 'Access equipment for planned maintenance and emergency preparedness.', 'https://shop.nexhse.co.ke/safety-ladder'],
  ['Workplace Safety Kit', 'PPE', 'General safety equipment for facilities, teams and operational readiness.', 'https://shop.nexhse.co.ke/workplace-safety-kit'],
] as const;
