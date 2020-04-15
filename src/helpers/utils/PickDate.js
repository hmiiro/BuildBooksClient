import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

export const PickDate = () => {
    const [startDate, setStartDate] = useState(new Date());
    return <DatePicker dateFormat="DD/MM/YYYY" selected={startDate} onChange={(date) => setStartDate(date)} />;
};
