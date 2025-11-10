import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadDetailsView } from "@/components/load-details/LoadDetailsView";
import { notFound } from "next/navigation";
import { getLoad } from "@/lib/datatruck-service";


export default async function LoadDetailsPage({ params }: { params: { loadId: string } }) {
  const load = await getLoad(params.loadId);

  if (!load) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-headline font-semibold tracking-tight sm:grow-0">
          Load {load.load_ref}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          {/* Action buttons can go here */}
        </div>
      </div>
      <LoadDetailsView load={load} />
    </div>
  );
}
