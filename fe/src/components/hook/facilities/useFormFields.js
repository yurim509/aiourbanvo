import React, { useState } from 'react'

const useFormFields = (initialState) => {
    const [formData, setFormData] = useState(initialState);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    return [formData, handleFieldChange];
}

export default useFormFields