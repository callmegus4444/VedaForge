import mongoose from 'mongoose';
import 'dotenv/config';

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || '', { dbName: 'vedaforge' });
  const Assignment = mongoose.connection.collection('assignments');
  const GeneratedPaper = mongoose.connection.collection('generatedpapers');

  const papers = await GeneratedPaper.find({}).toArray();
  console.log('Papers in DB:', papers.map((p: any) => ({ _id: p._id, assignmentId: p.assignmentId })));

  const assignments = await Assignment.find({}).sort({createdAt: -1}).limit(5).toArray();
  console.log('Recent assignments:', assignments.map((a: any) => ({ _id: a._id, title: a.title, status: a.status })));
  
  process.exit(0);
}
check();
