import { Spinner } from "@/components/ui";

const Loading = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner label="Loading page" />
    </div>
  );
}

export default Loading;