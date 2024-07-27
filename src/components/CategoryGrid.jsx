import React from "react";
import "./styles/CategoryGrid.css";

const categories = [
    { id: 1, name: "Α/ΓΕΣ" },
    { id: 2, name: "Α/ΓΕΕΘΑ" },
    { id: 3, name: "ΥΠΕΘΑ" },
    { id: 4, name: "ΥΦΕΘΑ" },
    { id: 5, name: "ΣΤΡΑΤΟΣ" },
    { id: 6, name: "ΚΑΤΑΓΓΕΛΙΕΣ" },
    { id: 7, name: "ΕΞΟΠΛΙΣΤΙΚΑ" },
    { id: 8, name: "ΔΙΕΘΝΗ" },
    // Add more categories as needed
];

function CategoryGrid() {
    return (
        <div className="category-grid">
            {categories.map((category) => (
                <div key={category.id} className="category-box">
                    {category.name}
                </div>
            ))}
        </div>
    );
}

export default CategoryGrid;
