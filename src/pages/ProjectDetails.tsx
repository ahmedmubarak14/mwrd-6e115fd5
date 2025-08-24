
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Project ID: {id}</p>
          <p>Project details will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
