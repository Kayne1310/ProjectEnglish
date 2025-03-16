 export const calculateDaysAgo = (createdAt) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    
    // Tính số ngày giữa hai ngày
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};
