import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTitleIds, getTitleById } from "@/modules/catalog";
import { TitleDetailView } from "@/features/catalog/views";

export const generateStaticParams = () => {
  return getAllTitleIds().map((id) => ({ id }));
};

export const generateMetadata = ({
  params,
}: {
  params: { id: string };
}): Metadata => {
  const title = getTitleById(params.id);
  if (!title) return { title: "Not found · Content Browser" };
  return {
    title: `${title.title} · Content Browser`,
    description: title.synopsis,
  };
};

const TitlePage = ({ params }: { params: { id: string } }) => {
  const title = getTitleById(params.id);
  if (!title) notFound();

  return <TitleDetailView title={title} />;
};

export default TitlePage;
