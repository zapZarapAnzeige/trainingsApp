export default function Exercise({ params }: { params: { exercice: string } }) {
  return (
    <h1 className="flex justify-start items-start mt-4 ml-4 text-gray-700">
      Exercice: {params.exercice}
    </h1>
  );
}
