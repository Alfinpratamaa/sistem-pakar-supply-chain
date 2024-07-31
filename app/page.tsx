import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  return (
    <>
      <div className="container max-w-6xl mt-28 flex md:flex-row flex-col h-screen">
        <div className="flex flex-col gap-5 max-w-xl w-full md:w-1/2 md:mt-5 md:ms-5 -mt-14  ">
          <h1 className="font-bold md:text-3xl text-xl text-secondary-foreground">
            Selamat Datang <span className="text-primary font-semibold md:text-3xl text-xl">{session?.user?.username || session?.user?.name}</span>
          </h1>
          <p>
            Klik <span className="text-primary font-semibold">diagnosa</span> untuk menganalisa masalah yang mungkin terjadi dalam proses supply chain Anda dan temukan solusi yang efisien untuk mengatasinya. Dengan bantuan sistem pakar ini, Anda dapat meningkatkan efisiensi, mengurangi biaya, dan memastikan kelancaran operasi bisnis Anda.
          </p>
          <div className="flex md:flex-row flex-col gap-5">
            <Link href={"/question"}>
              <Button className="w-full md:w-32 h-auto" variant={"default"}>Diagnosa</Button>
            </Link>
            <Link href={"history"}>
              <Button className="w-full md:w-32 h-auto border border-primary" variant={"outline"}>History</Button>
            </Link>
          </div>
        </div>
        <div className="w-1/2 flex justify-center md:mt-0 mt-5 mx-auto md:mx-0">
          <img src="/images/oip.png" alt="Supply Chain" className="max-w-full h-[300px]" />
        </div>
      </div>
    </>
  );
};

export default page;
