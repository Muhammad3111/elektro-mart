// Form validation utilities

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean;
    message?: string;
}

export interface ValidationRules {
    [key: string]: ValidationRule;
}

export interface ValidationErrors {
    [key: string]: string;
}

export function validateField(
    value: any,
    rules: ValidationRule,
    fieldName: string
): string | null {
    // Required check
    if (rules.required && (!value || value.toString().trim() === "")) {
        return rules.message || `${fieldName} majburiy maydon`;
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === "") {
        return null;
    }

    // Min length check
    if (rules.minLength && value.toString().length < rules.minLength) {
        return rules.message || `${fieldName} kamida ${rules.minLength} ta belgidan iborat bo'lishi kerak`;
    }

    // Max length check
    if (rules.maxLength && value.toString().length > rules.maxLength) {
        return rules.message || `${fieldName} maksimal ${rules.maxLength} ta belgidan iborat bo'lishi kerak`;
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(value.toString())) {
        return rules.message || `${fieldName} noto'g'ri formatda`;
    }

    // Min value check (for numbers)
    if (rules.min !== undefined && Number(value) < rules.min) {
        return rules.message || `${fieldName} kamida ${rules.min} bo'lishi kerak`;
    }

    // Max value check (for numbers)
    if (rules.max !== undefined && Number(value) > rules.max) {
        return rules.message || `${fieldName} maksimal ${rules.max} bo'lishi kerak`;
    }

    // Custom validation
    if (rules.custom && !rules.custom(value)) {
        return rules.message || `${fieldName} noto'g'ri qiymat`;
    }

    return null;
}

export function validateForm(
    data: { [key: string]: any },
    rules: ValidationRules
): ValidationErrors {
    const errors: ValidationErrors = {};

    Object.keys(rules).forEach((fieldName) => {
        const error = validateField(data[fieldName], rules[fieldName], fieldName);
        if (error) {
            errors[fieldName] = error;
        }
    });

    return errors;
}

// Common validation patterns
export const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+998)?[0-9]{9}$/,
    url: /^https?:\/\/.+/,
    number: /^[0-9]+$/,
    decimal: /^[0-9]+(\.[0-9]+)?$/,
};

// Pre-defined validation rules
export const commonRules = {
    email: {
        required: true,
        pattern: patterns.email,
        message: "Email noto'g'ri formatda",
    },
    phone: {
        required: true,
        pattern: patterns.phone,
        message: "Telefon raqam noto'g'ri formatda",
    },
    password: {
        required: true,
        minLength: 6,
        message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    },
    name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: "Ism 2-100 ta belgi orasida bo'lishi kerak",
    },
    price: {
        required: true,
        min: 0,
        message: "Narx 0 dan katta bo'lishi kerak",
    },
    stock: {
        required: true,
        min: 0,
        message: "Ombor soni 0 dan katta yoki teng bo'lishi kerak",
    },
};

// Product validation rules
export const productValidationRules: ValidationRules = {
    name: {
        required: true,
        minLength: 3,
        maxLength: 200,
        message: "Mahsulot nomi 3-200 ta belgi orasida bo'lishi kerak",
    },
    nameRu: {
        required: true,
        minLength: 3,
        maxLength: 200,
        message: "Mahsulot nomi (Rus) 3-200 ta belgi orasida bo'lishi kerak",
    },
    price: {
        required: true,
        min: 0,
        message: "Narx 0 dan katta bo'lishi kerak",
    },
    category: {
        required: true,
        message: "Kategoriya tanlanishi shart",
    },
    stock: {
        required: true,
        min: 0,
        message: "Ombor soni 0 dan katta yoki teng bo'lishi kerak",
    },
    description: {
        maxLength: 1000,
        message: "Tavsif maksimal 1000 ta belgidan iborat bo'lishi kerak",
    },
};

// User validation rules
export const userValidationRules: ValidationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: "Ism 2-100 ta belgi orasida bo'lishi kerak",
    },
    email: {
        required: true,
        pattern: patterns.email,
        message: "Email noto'g'ri formatda",
    },
    phone: {
        required: true,
        pattern: patterns.phone,
        message: "Telefon raqam noto'g'ri formatda",
    },
    password: {
        minLength: 6,
        message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    },
    role: {
        required: true,
        message: "Rol tanlanishi shart",
    },
};

// Category validation rules
export const categoryValidationRules: ValidationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: "Kategoriya nomi 2-100 ta belgi orasida bo'lishi kerak",
    },
    nameRu: {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: "Kategoriya nomi (Rus) 2-100 ta belgi orasida bo'lishi kerak",
    },
    slug: {
        required: true,
        pattern: /^[a-z0-9-]+$/,
        message: "Slug faqat kichik harflar, raqamlar va tire (-) dan iborat bo'lishi kerak",
    },
};

// Slider validation rules
export const sliderValidationRules: ValidationRules = {
    title: {
        required: true,
        minLength: 3,
        maxLength: 200,
        message: "Sarlavha 3-200 ta belgi orasida bo'lishi kerak",
    },
    titleRu: {
        required: true,
        minLength: 3,
        maxLength: 200,
        message: "Sarlavha (Rus) 3-200 ta belgi orasida bo'lishi kerak",
    },
    image: {
        required: true,
        message: "Rasm tanlanishi shart",
    },
    link: {
        pattern: /^\/.+/,
        message: "Havola / bilan boshlanishi kerak",
    },
};
