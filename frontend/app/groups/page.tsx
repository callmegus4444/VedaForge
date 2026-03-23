"use client";
export default function GroupsPage() {
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
      <div style={{ fontSize: '48px' }}>👥</div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
        My Groups
      </h1>
      <p style={{ color: '#666', fontSize: '15px', margin: 0, maxWidth: '300px' }}>
        Create and manage your student groups. Coming soon.
      </p>
    </div>
  );
}
