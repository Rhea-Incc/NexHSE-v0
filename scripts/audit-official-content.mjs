import assert from 'node:assert/strict';
import { loadEnvFile } from 'node:process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { listServices } from '@workspace/db';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = path.join(repoRoot, 'artifacts/nexhse-africa');
loadEnvFile(path.join(repoRoot, '.env.local'));

const categories = [
  'OSH — TRAINING & CAPACITY BUILDING',
  'ASSESSMENTS, AUDITS & POLICY',
  'SPECIALISED SERVICES',
  'EQUIPMENT SUPPLY',
  'ENVIRONMENTAL MANAGEMENT',
];

const expectedServices = [
  ['OSH Training', categories[0], 'Builds core hazard awareness and legal compliance org-wide.', 'Your workforce spots and stops hazards before they become incidents.'],
  ['Fire Safety Training', categories[0], 'Prevention, response and evacuation skills, including fire marshals.', "Your building passes fire inspections — and your team doesn't freeze in a real fire."],
  ['First Aid Training', categories[0], 'Certified first aider and refresher training aligned to the 2024 Regulations.', 'A trained responder is on-site the moment an injury happens.'],
  ['Work at Height & Confined Space Training', categories[0], 'Specialised competence for high-risk access, fall protection and entry.', 'High-risk tasks are done only by people actually qualified to do them.'],
  ['Emergency Response Training', categories[0], 'Builds organisational readiness to respond to workplace emergencies.', 'Your team reacts fast and correctly — not in panic — when something goes wrong.'],
  ['Training on Alcohol & Drug', categories[0], 'Awareness training and workplace policy support for substance-related risk.', 'Substance-related incidents get prevented, not just punished after the fact.'],
  ['PPE Training', categories[0], 'Correct selection, fitting and use of personal protective equipment.', "PPE actually protects — because it's worn and used correctly."],
  ['Risk Assessments', categories[1], 'Identifies and controls workplace hazards before they cause harm.', 'You know your real exposure before an incident forces you to find out.'],
  ['Health & Safety Audits', categories[1], 'Independent verification against statutory and ISO 45001 standards.', 'You walk into any inspection or lender review with evidence, not excuses.'],
  ['Fire Safety Inspections & Audits', categories[1], 'Verifies fire controls against the Fire Risk Reduction Rules, 2007.', 'No surprises when the fire inspector shows up.'],
  ['Development of OSH Policies', categories[1], 'Tailored policy frameworks built for your operation.', 'A safety management system that actually functions — not a binder on a shelf.'],
  ['Asbestos Containing Materials (ACM) Surveys', categories[1], 'Identification and risk management of legacy asbestos hazards.', 'You know where the risk is before it becomes a lawsuit or a stalled demolition.'],
  ['Chemical & Mechanical Safety', categories[2], 'Safe handling, storage and operation around hazards and machinery.', 'Fewer chemical-exposure and machinery incidents on your site.'],
  ['Disaster Preparedness & Management', categories[2], 'Structured planning and readiness for large-scale or catastrophic events.', 'Your organisation has a plan before the crisis, not during it.'],
  ['Construction Site Safety Management & Monitoring', categories[2], 'On-site HSE oversight and supervision through the project lifecycle.', 'Continuous safety coverage without hiring a full-time HSE officer.'],
  ['Firefighting Equipment Supply & Maintenance', categories[3], 'Reliable, inspected firefighting equipment supply and upkeep.', 'Equipment works the one time it actually matters.'],
  ['PPE Supply', categories[3], 'Quality PPE supplied alongside the training to use it correctly.', "Staff are equipped and know how to use exactly what they're given."],
  ['First Aid Appliances Supply', categories[3], 'Fully stocked, compliant first aid kits and station equipment.', "No excuse for an empty first aid box when it's needed most."],
  ['Environmental Impact Assessment & Audits', categories[4], 'Assesses and verifies environmental compliance and impact management.', 'Your project clears NEMA approval without a redesign-and-resubmit cycle.'],
  ['Environmental Education (Training)', categories[4], 'Builds environmental awareness and responsibility across your workforce.', 'Your team makes environmentally sound decisions without being told twice.'],
  ['Environmental Policies & Management Plans', categories[4], 'Structured frameworks that guide consistent environmental performance.', 'Consistent environmental practice — not ad hoc decisions per site.'],
  ['Environmental Management Systems', categories[4], 'Systems-based approach to continual environmental improvement.', 'Environmental performance that improves year over year, not just once.'],
  ['Waste Management', categories[4], 'Safe, compliant handling, storage and disposal of waste streams.', 'No regulatory exposure from how your waste is handled.'],
  ['Effluent & Emissions Management', categories[4], 'Discharge control planning and monitoring for liquid and airborne emissions.', 'Emissions stay within legal limits — verifiably.'],
];

const aboutText = [
  'NexHSE Africa is a Kenya-based Environmental, Health and Safety (EHS) consultancy helping organizations protect their people, their environment, and their ability to grow. We work with construction firms, manufacturers, EPZ operators, distributors, banking & finance sectors, telecom infrastructure providers, NGOs and donor-financed infrastructure projects across Kenya — with East Africa and the wider continent as the next chapter of our story.',
  "We believe safety and growth aren't in tension — they're the same goal. A workplace that protects its people is a workplace that can scale, win bigger contracts, and operate without the constant risk of incident, litigation, or lost time. That belief sits behind everything we do, from a single-day fire safety training to a full ISO 45001 management system rollout.",
  'To protect people, workplaces, and the environment across Africa by delivering practical, locally-grounded Environmental, Health and Safety solutions that empower organizations to grow safely.',
  "To be Africa's most trusted Environmental, Health and Safety partner — growing from Kenya across East Africa and, ultimately, the continent.",
  'The protection of life takes priority over deadlines, cost, or convenience — no exceptions.',
  "We report what we find, even when it's inconvenient for the client or for us. Our clients trust our findings because we don't soften them.",
  'We train for real competence and genuine behaviour change — not just a certificate that satisfies an inspector and gets filed away.',
  'The "E" in EHS is never an afterthought to the "HS." Environmental responsibility is built into how we assess and advise from the start.',
  "We measure our own success by one thing: our clients' ability to operate, scale, and expand safely.",
  'NexHSE Africa — currently serving the Kenyan market, with planned expansion across East Africa and, over time, the whole of Africa.',
];

const server = await createServer({ configFile: path.join(appRoot, 'vite.config.ts'), root: appRoot, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const source = await server.ssrLoadModule('/src/App.tsx');
  const sourceServices = source.services.map(service => [service.title, service.type, service.short, service.outcome]);
  assert.deepEqual(sourceServices, expectedServices, 'Static service source does not exactly match the official content');
  assert.equal(source.services.length, 24, 'Expected exactly 24 services in source');
  assert.deepEqual(categories.map(category => source.services.filter(service => service.type === category).length), [7, 5, 3, 3, 6], 'Official service category counts do not match');

  const appText = await readFile(path.join(appRoot, 'src/App.tsx'), 'utf8');
  for (const exactText of aboutText) assert.ok(appText.includes(exactText), `Missing exact About source text: ${exactText}`);
  assert.ok(appText.includes('What We Offer, What It Involves, What You Get'));
  assert.ok(appText.includes('Every NexHSE Africa service below is built around a real business outcome, not just a technical activity.'));
  for (const fieldLabel of ['SERVICE', 'WHAT IT IS', 'THE OUTCOME']) assert.ok(appText.includes(`>${fieldLabel}</p>`), `Missing visible service field label: ${fieldLabel}`);

  for (const functionName of ['FooterSlideshow', 'MobileNavSlideshow', 'HeroSlideshow', 'PageHeroSlideshow', 'ShopHero', 'ServiceGallery']) {
    const start = appText.indexOf(`function ${functionName}(`);
    assert.notEqual(start, -1, `Missing slideshow function: ${functionName}`);
    const end = appText.indexOf('\nfunction ', start + 1);
    const body = appText.slice(start, end === -1 ? appText.length : end);
    assert.match(body, /setInterval[\s\S]{0,180}7000\)/, `${functionName} does not use a seven-second loop`);
  }

  const liveServices = await listServices(true);
  const liveContent = liveServices.map(service => [service.title, service.type, service.short, service.outcome]);
  assert.deepEqual(liveContent, expectedServices, 'Live Neon services do not exactly match the official content');
  assert.equal(liveServices.length, 24, 'Expected exactly 24 services in Neon');

  console.log(JSON.stringify({ aboutStatementsVerified: aboutText.length, sourceServicesVerified: sourceServices.length, neonServicesVerified: liveServices.length, categoryCounts: [7, 5, 3, 3, 6], slideshowIntervalMs: 7000 }, null, 2));
} finally {
  await server.close();
}
