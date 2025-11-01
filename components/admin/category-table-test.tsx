"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export function CategoryTableTest() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Dialog Test</h1>
      
      <Button onClick={() => {
        console.log("Button clicked!");
        setOpen(true);
        console.log("Open set to:", true);
      }}>
        <Plus className="w-4 h-4 mr-2" />
        Open Dialog
      </Button>

      <p className="mt-4">Dialog state: {open ? "OPEN" : "CLOSED"}</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>This is a test dialog!</p>
            <Button onClick={() => setOpen(false)} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
