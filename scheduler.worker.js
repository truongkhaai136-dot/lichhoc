// scheduler.worker.js

let schedules = [];
let timeouts = {};

// Lắng nghe tin nhắn từ trang chính
self.onmessage = function(e) {
    // Nhận danh sách lịch học mới và thiết lập lại bộ đếm thời gian
    schedules = e.data;
    Object.values(timeouts).forEach(clearTimeout);
    timeouts = {};

    const now = new Date();

    schedules.forEach(schedule => {
        const startDateTime = new Date(schedule.startDateTimeString);
        if (startDateTime > now && schedule.status === 'waiting') {
            const timeToStart = startDateTime.getTime() - now.getTime();
            
            // setTimeout trong Worker rất đáng tin cậy
            timeouts[schedule.id] = setTimeout(() => {
                // Khi đến giờ, gửi tin nhắn chứa ID của lịch học trở lại trang chính
                self.postMessage(schedule.id);
            }, timeToStart);
        }
    });
};
