import React, { useState, useRef, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Space } from 'antd';
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Button, Box } from '@mui/material'
import { parse } from 'date-fns'
import { PickersLayout, PickersLayoutProps } from '@mui/x-date-pickers/PickersLayout'

interface ListFilterProps {
    onSearch: (searchVal: string, startDate: string | null, endDate: string | null) => void;
    data?: any
}

export const ListFilterAuction: React.FC<ListFilterProps> = ({ onSearch, data }) => {
    // console.log(data, 'datat')

    const [searchVal, setSearchVal] = useState<string>("");
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [calendarOpen, setCalendarOpen] = useState(true);
    const [tempDate, setTempDate] = useState<Date | null>(selectedDate);

    // const { RangePicker } = DatePicker;

    const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

    const auctionDatesParsed = useMemo(() => {
        return data
            .map((item: any) => parse(item.start_date, 'dd MMMM, yyyy', new Date()))
            .filter((date: Date) => !isNaN(date.getTime()));
    }, [data]);


    const handleOk = () => {
        setSelectedDate(tempDate);
        setCalendarOpen(false);
    };

    const handleCancel = () => {
        setTempDate(selectedDate); // revert temp selection
        setCalendarOpen(false);
    };

    // Handle Search Input
    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchVal(value);

        // Pass the current selected date when searching
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            onSearch(value, dateString, dateString);
        } else {
            onSearch(value, null, null);
        }
    };




    function CustomDatePickerLayout(props: PickersLayoutProps<any>) {
        return (
            <div style={{ position: 'relative' }}>
                <PickersLayout {...props} />
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 2,
                    mb: 2,
                    px: 2,
                }}>
                    <Button color="warning" onClick={handleCancel}>Cancel</Button>
                    <Button color="warning" onClick={handleOk}>OK</Button>
                </Box>
            </div>
        );
    }

    return (
        <section className="flex justify-between items-center mt-6 ">
            <div className="relative ">
                <span className="absolute mr-6 mt-3">
                    <CiSearch className="text-xl mx-2" />
                </span>
                <input
                    type="text"
                    name="Search here..."
                    id="search"
                    placeholder="Search here..."
                    className=" pl-8 py-2 text-sm focus:text-black focus:outline-[#FCDFD4] border rounded-lg w-auto xl:w-[300px] 2xl:w-[300px] md:w-[300px] xlw-[300px] lg:w-[300px]"
                    value={searchVal}
                    onChange={handleSearchInputChange}
                    autoComplete="off"
                />
            </div>

            <div className="flex gap-2 items-center">
                <div className="w-full md:w-auto">
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                desktopModeMediaQuery="@media (min-width: 0px)"
                                open={calendarOpen}
                                onOpen={() => setCalendarOpen(true)}
                                onClose={() => setCalendarOpen(false)}
                                value={tempDate}
                                onChange={(date: Date | null) => setTempDate(date)}
                                slots={{
                                    day: ({ day, selected, ...rest }) => {
                                        const isAuctionDay = auctionDatesParsed.some(
                                            (d: Date) =>
                                                d.getDate() === day.getDate() &&
                                                d.getMonth() === day.getMonth() &&
                                                d.getFullYear() === day.getFullYear()
                                        );
                                        return (
                                            <button
                                                type="button"
                                                tabIndex={rest.tabIndex}
                                                aria-label={rest['aria-label']}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    margin: 2,
                                                    background: isAuctionDay ? '#F25E26' : 'transparent',
                                                    color: isAuctionDay ? '#fff' : '#222',
                                                    fontWeight: isAuctionDay ? 700 : 400,
                                                    fontSize: 18,
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                }}
                                                onClick={() => setTempDate(day)}
                                            >
                                                {day.getDate()}
                                            </button>
                                        );
                                    },
                                    layout: CustomDatePickerLayout,
                                }}
                                slotProps={{
                                    textField: {
                                        variant: 'outlined',
                                        fullWidth: true,
                                        sx: {
                                            '& input': { padding: 2, borderRadius: 2, fontSize: 18 }
                                        }
                                    },
                                    popper: {
                                        sx: { pb: 6 }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                </div>


            </div>
        </section>
    );
};
