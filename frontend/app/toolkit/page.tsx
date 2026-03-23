"use client";
export default function ToolkitPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px' }}>🤖</div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
        AI Teacher's Toolkit
      </h1>
      <p style={{ color: '#666', fontSize: '15px', margin: 0, maxWidth: '300px' }}>
        Auto grading, rubric builder, and progress tracking. Coming soon.
      </p>
    </div>
  );
}
