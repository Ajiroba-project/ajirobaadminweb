import React, { useState, useRef, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
// import DatePicker from "react-datepicker";
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

        // Trigger search with local YYYY-MM-DD (avoid UTC shift)
        if (tempDate) {
            const y = tempDate.getFullYear();
            const m = String(tempDate.getMonth() + 1).padStart(2, '0');
            const d = String(tempDate.getDate()).padStart(2, '0');
            const dateString = `${y}-${m}-${d}`;
            onSearch(searchVal, dateString, dateString);
        } else {
            onSearch(searchVal, null, null);
        }
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
            const y = selectedDate.getFullYear();
            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const d = String(selectedDate.getDate()).padStart(2, '0');
            const dateString = `${y}-${m}-${d}`;
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
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 mt-4 lg:mt-6">
            {/* Search Input */}
            <div className="relative w-full lg:w-auto">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CiSearch className="text-lg lg:text-xl" />
                </span>
                <input
                    type="text"
                    name="Search here..."
                    id="search"
                    placeholder="Search here..."
                    className="w-full lg:w-64 xl:w-80 pl-10 pr-4 py-2 lg:py-3 text-sm lg:text-base focus:text-black focus:outline-none focus:ring-2 focus:ring-[#FCDFD4] border border-gray-300 rounded-lg transition-all duration-200"
                    value={searchVal}
                    onChange={handleSearchInputChange}
                    autoComplete="off"
                />
            </div>

            {/* Date Picker */}
            <div className="w-full lg:w-auto">
                <div className="w-full sm:w-48">
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
                                        '& input': { 
                                            padding: '8px 12px', 
                                            borderRadius: '8px', 
                                            fontSize: '14px',
                                            border: '1px solid #d1d5db',
                                            '&:focus': {
                                                outline: 'none',
                                                borderColor: '#FCDFD4',
                                                boxShadow: '0 0 0 2px rgba(252, 223, 212, 0.2)'
                                            }
                                        }
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
        </section>
    );
};
