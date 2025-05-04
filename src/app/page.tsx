import Quiz from "@/components/quiz/Quiz";

export default function Home() {
  return (
    <div className="container mx-auto p-4 flex justify-center items-start min-h-screen pt-10">
       {/* Removed Card wrapper from here, Quiz component has its own Card */}
       <Quiz />
    </div>
  );
}