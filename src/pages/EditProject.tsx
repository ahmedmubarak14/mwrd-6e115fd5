
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EditProject = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Editing project ID: {id}</p>
          <p>Project editing form will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProject;
