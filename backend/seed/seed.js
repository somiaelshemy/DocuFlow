const { User, Workflow, Stage, WorkflowInstance, Request, sequelize } = require('../src/models');
const bcrypt = require('bcryptjs');

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: this will drop all tables

  // Create users
  const hashedPassword = "password123";
  const [professor, manager, admin] = await Promise.all([
    User.create({ firstName: 'Alice', lastName: 'Prof', email: 'prof@example.com', password: hashedPassword, role: 'professor' }),
    User.create({ firstName: 'Bob', lastName: 'Manager', email: 'manager@example.com', password: hashedPassword, role: 'department_manager' }),
    User.create({ firstName: 'Carol', lastName: 'Admin', email: 'admin@example.com', password: hashedPassword, role: 'administrator' }),
  ]);

  // Define workflows with varied lengths and roles
  const workflowsData = [
    {
      title: 'Research Proposal Approval',
      description: 'Workflow for approving research proposals',
      stages: [
        { title: 'Initial Submission', role: 'professor', description: 'Submit proposal' },
        { title: 'Department Review', role: 'department_manager', description: 'Review proposal' },
      ],
      note: 'Requesting approval for my AI research proposal',
    },
    {
      title: 'Internship Approval',
      description: 'Approval process for internship plans',
      stages: [
        { title: 'Plan Submission', role: 'professor', description: 'Submit internship plan' },
        { title: 'Manager Review', role: 'department_manager', description: 'Review the plan' },
        { title: 'Admin Final Approval', role: 'administrator', description: 'Final sign-off' },
      ],
      note: 'Internship at XYZ Lab on computer vision',
    },
    {
      title: 'Thesis Registration',
      description: 'Register final year thesis topic',
      stages: [
        { title: 'Topic Proposal', role: 'professor', description: 'Suggest a thesis topic' },
        { title: 'Manager Approval', role: 'department_manager', description: 'Review topic suitability' },
        { title: 'Admin Record Entry', role: 'administrator', description: 'Record thesis officially' },
        { title: 'Student Notification', role: 'professor', description: 'Notify student' },
      ],
      note: 'Registering thesis on federated learning',
    },
    {
      title: 'Equipment Loan Request',
      description: 'Request for borrowing lab equipment',
      stages: [
        { title: 'Request Submission', role: 'professor', description: 'Submit equipment request' },
        { title: 'Manager Authorization', role: 'department_manager', description: 'Authorize request' },
      ],
      note: 'Need an oscilloscope for signal experiments',
    },
    {
      title: 'Course Feedback Review',
      description: 'Workflow for reviewing student course feedback',
      stages: [
        { title: 'Initial Report by Prof', role: 'professor', description: 'Upload feedback summary' },
        { title: 'Manager Discussion', role: 'department_manager', description: 'Review concerns' },
        { title: 'Admin Action', role: 'administrator', description: 'Take necessary steps' },
      ],
      note: 'Feedback summary for course COMP302',
    },
  ];

  // Seed workflows
  for (const workflowData of workflowsData) {
    const workflow = await Workflow.create({
      title: workflowData.title,
      description: workflowData.description,
    });

    const stages = await Promise.all(
      workflowData.stages.map((stage, index) =>
        Stage.create({
          title: stage.title,
          description: stage.description,
          role: stage.role,
          stageOrder: index + 1,
          workflowId: workflow.id,
        })
      )
    );

    const instance = await WorkflowInstance.create({
      workflowId: workflow.id,
      stageId: stages[0].id,
      userId: professor.id, // You can randomize later if needed
    });

    await Request.create({
      instanceId: instance.id,
      stageId: stages[0].id,
      userId: professor.id,
      note: workflowData.note,
      status: 'pending',
      assignedToUserId: manager.id
    });
  }

  console.log('🌱 Seeding complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
