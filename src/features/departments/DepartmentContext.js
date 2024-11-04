// src/context/DepartmentContext.js
import React, { createContext, useContext, useState } from 'react';

const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
    const [departmentId, setDepartmentId] = useState(null);

    const updateDepartmentId = (id) => setDepartmentId(id);

    return (
        <DepartmentContext.Provider value={{ departmentId, updateDepartmentId }}>
            {children}
        </DepartmentContext.Provider>
    );
};

export const useDepartment = () => useContext(DepartmentContext);