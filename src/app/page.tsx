
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the App!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the starting point of your application. Let's build something great!</p>
        </CardContent>
      </Card>
    </div>
  );
}
