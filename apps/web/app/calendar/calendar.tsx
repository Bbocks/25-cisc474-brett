'use client';

import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from '@/_components/ui/shadcn-io/calendar';

export type CalendarFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: { id: string; name: string; color: string };
  classId: string;
  classColor: string;
};

interface CalendarProps {
  visibleClasses: Record<string, boolean>;
  classes: Array<{ id: string; name: string; color: string; visible: boolean }>;
  features: CalendarFeature[];
}

const Calendar = ({ visibleClasses, features }: CalendarProps) => {
  const filteredFeatures: CalendarFeature[] = features.filter(feature => visibleClasses[feature.classId]);
  const years = filteredFeatures.length > 0 ? filteredFeatures.reduce<{ min: number; max: number }>((acc, f) => ({
    min: Math.min(acc.min, f.startAt.getFullYear()),
    max: Math.max(acc.max, f.endAt.getFullYear()),
  }), { min: filteredFeatures[0]!.startAt.getFullYear(), max: filteredFeatures[0]!.endAt.getFullYear() }) : { min: new Date().getFullYear(), max: new Date().getFullYear() };

  return (
    <CalendarProvider>
      <CalendarDate>
        <CalendarDatePicker>
          <CalendarMonthPicker />
          <CalendarYearPicker end={years.max} start={years.min} />
        </CalendarDatePicker>
        <CalendarDatePagination />
      </CalendarDate>
      <CalendarHeader />
      <CalendarBody features={filteredFeatures}>
        {({ feature }) => <CalendarItem feature={feature} key={feature.id} />}
      </CalendarBody>
    </CalendarProvider>
  );
};

export default Calendar;
