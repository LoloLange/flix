import { Credits } from "@/app/components/media/Credits";
import { Info } from "@/app/components/media/Info";
import { Movie } from "@/app/components/media/Movie";
import { Recommendations } from "@/app/components/media/Recommendations";
import {
  movieCredits,
  movieDetails,
  movieRecommendations,
} from "@/app/lib/api";
import { months } from "@/app/lib/constants";
import { MovieCredits, MovieDetails } from "@/app/types/types";
import { notFound } from "next/navigation";

interface MoviePageProps {
  params: { id: string };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = params;

  if (!id) {
    return notFound();
  }

  const movie: MovieDetails = await movieDetails(id);
  const credits: MovieCredits = await movieCredits(id);
  const { results: recommendations }: { results: MovieDetails[] } =
    await movieRecommendations(id);

  if (!movie) {
    return notFound();
  }

  const getMonth = (date: string) => {
    const month = date.split("-")[1];
    const monthName = months.find((m) => m.id === parseInt(month));
    const year = date.split("-")[0];
    return monthName?.name + " " + year;
  };

  return (
    <main className="flex flex-col gap-y-[200px]">
      <Movie movie={movie} getMonth={getMonth} />
      <section className="flex flex-col gap-y-10 px-36">
        {credits.cast.length > 0 && <Credits credits={credits} cast={true} />}
        {credits.crew.length > 0 && <Credits credits={credits} cast={false} />}
        <Info movie={movie} getMonth={getMonth} />
        <Recommendations recommendations={recommendations} />
      </section>
    </main>
  );
}
