export default async function GuardianChildPage({ 
  params 
}: { 
  params: { childId: string } 
}) {
  const { childId } = params;
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Child Dashboard</h1>
      <p>Child ID: {childId}</p>
      <p>This page is under development.</p>
    </div>
  );
}
