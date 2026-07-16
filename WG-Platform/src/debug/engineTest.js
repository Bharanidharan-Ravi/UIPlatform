import SearchNormalizer from "../engines/search/core/SearchNormalizer";
import { platformLog } from "./index";

// ----------------------------------------------------
// Test Data
// ----------------------------------------------------

const products = [
    {
        Id: 1,
        Code: "PRD-001",
        Name: "Apple iPhone 16 Pro Max",
        Price: 129999,
        Stock: 15,
        IsActive: true,

        Category: {
            Id: 10,
            Name: "Mobile Phones"
        },

        Brand: {
            Id: 1,
            Name: "Apple"
        },

        Supplier: {
            Id: 50,
            Name: "Apple India Pvt Ltd"
        },

        Tags: [
            "Apple",
            "IOS",
            "Smartphone",
            "Premium"
        ]
    },

    {
        Id: 2,
        Code: "PRD-002",
        Name: "Samsung Galaxy S25 Ultra",
        Price: 119999,
        Stock: 20,
        IsActive: true,

        Category: {
            Id: 10,
            Name: "Mobile Phones"
        },

        Brand: {
            Id: 2,
            Name: "Samsung"
        },

        Supplier: {
            Id: 51,
            Name: "Samsung India"
        },

        Tags: [
            "Samsung",
            "Android",
            "Camera"
        ]
    },

    {
        Id: 3,
        Code: "PRD-003",
        Name: "Dell XPS 15",
        Price: 179999,
        Stock: 6,
        IsActive: false,

        Category: {
            Id: 20,
            Name: "Laptop"
        },

        Brand: {
            Id: 3,
            Name: "Dell"
        },

        Supplier: {
            Id: 52,
            Name: "Dell Technologies"
        },

        Tags: [
            "Laptop",
            "Windows",
            "Developer"
        ]
    }
];

// ----------------------------------------------------
// Test
// ----------------------------------------------------

const normalized = SearchNormalizer.normalize(products);

// Console
console.table(normalized);

// Platform Debug
platformLog(
    "SEARCH",
    "Normalized Documents",
    normalized
);

// Raw
console.log(JSON.stringify(normalized, null, 2));

export default normalized;