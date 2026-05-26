import { create } from "zustand";

type SelectedDayState = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export const useSelectedDayStore = create<SelectedDayState>((set) => ({
  selectedDate: new Date(), 
  setSelectedDate: (date) => set({selectedDate: new Date(date)}),
}));