export const calculateDaysAgo = (createdAt) => {

    const createdDate = new Date(createdAt);

    // Thêm 7 giờ vào thời gian UTC


    const now = new Date();
    
    const diffInMilliseconds = now - createdDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Dưới 1 phút
    if (diffInSeconds < 60) {
        return 'now';
    }
    
    // Dưới 1 giờ
    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    }
    
    // Dưới 24 giờ
    if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    }
    
    // Dưới 30 ngày
    if (diffInDays < 30) {
        return `${diffInDays} ngày trước`;
    }
    
    // Dưới 12 tháng
    if (diffInMonths < 12) {
        return `${diffInMonths} tháng trước`;
    }
    
    // Trên 1 năm
    return `${diffInYears} năm trước`;
};