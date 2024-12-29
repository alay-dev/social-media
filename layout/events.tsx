import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Events = () => {
  return (
    <div className="w-[19rem] hidden lg:flex ">
      <div className="bg-white rounded-xl p-4 border border-blue-200 h-max">
        <div className="flex items-center justify-between">
          <h4 className=" font-bold">Upcoming events</h4>
          <Button variant={"link"}>See all</Button>
        </div>
        <Separator className="mb-4" />
        <div className="bg-gray-100 p-3 rounded-lg mb-3">
          <div className="flex items-center gap-2 mb-3">
            <img
              src="https://images.unsplash.com/photo-1602576666092-bf6447a729fc?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className=" w-11 h-11 rounded-sm"
            />
            <div>
              <h4 className="font-semibold text-sm">Design talks</h4>
              <p className="text-xs text-gray-500">3rd Jan, 2024</p>
            </div>
          </div>
          <p className="text-sm text-gray-800">
            A general talk about design with Sr. Designer of Logitech Michael
            Spunfik.
          </p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg ">
          <div className="flex items-center gap-2 mb-3">
            <img
              src="https://images.unsplash.com/photo-1602576666092-bf6447a729fc?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="w-11 h-11 rounded-sm"
            />
            <div>
              <h4 className="font-semibold text-sm">Design talks</h4>
              <p className="text-xs text-gray-500">3rd Jan, 2024</p>
            </div>
          </div>
          <p className="text-sm text-gray-7800">
            A general talk about design with Sr. Designer of Logitech Michael
            Spunfik.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;
