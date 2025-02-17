document.addEventListener("DOMContentLoaded", function () {
    function updateLabel(inputId) {
        const dateInput = document.getElementById(inputId);
        const dateLabel = document.querySelector(`label[for='${inputId}']`);

        // Khi click vào label, mở lịch chọn ngày
        dateLabel.addEventListener("click", function () {
            dateInput.showPicker(); // Mở lịch chọn ngày
        });

        dateInput.addEventListener("change", function () {
            if (this.value) {
                // Lấy giá trị YYYY-MM-DD và tách thành phần ngày, tháng, năm
                const [year, month, day] = this.value.split('-');
        
                // Tạo đối tượng Date theo giờ địa phương, tránh lỗi múi giờ
                const selectedDate = new Date(year, month - 1, day);
        
                // Định dạng ngày thành 'Sun, 16-02-2025'
                const options = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
                const formattedDate = selectedDate.toLocaleDateString('en-GB', options).replace(/\//g, '-');
        
                // Cập nhật nội dung label
                dateLabel.textContent = formattedDate;
            } else {
                dateLabel.textContent = "Choose Date"; // Khi input trống, đặt lại label
            }
        });
        
    }

    // Kích hoạt cho cả hai input
    updateLabel("input-Current-store-time");
    updateLabel("input-Time-chosen-by-customer");
});



// Function to convert time to 12-hour format with AM/PM
function convertTo12HourFormat(hour, minute, second) {
    let amPm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) {
        hour -= 12;
    } else if (hour === 0) {
        hour = 12;
    }

    minute = minute.toString().padStart(2, "0");
    second = second.toString().padStart(2, "0");

    return `${hour}:${minute}:${second} ${amPm}`;
}

// Update clocks for Houston and HCM
function updateClocks() {
    const houstonTime = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
    const hcmTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    const vicTime = new Date().toLocaleString("en-US", { timeZone: "Australia/Melbourne" });

    const houstonDate = new Date(houstonTime);
    const hcmDate = new Date(hcmTime);
    const vicDate = new Date(vicTime);

    function formatDate(date, style) {
        const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const daysVietnamese = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        if (style === "houston") {
            return `${daysShort[date.getDay()]}, ${day}-${month}-${year}`;
        } else if (style === "hcm") {
            return `${daysVietnamese[date.getDay()]}, ${day}-${month}-${year}`;
        } else if (style === "vic") {
            return `${daysShort[date.getDay()]}, ${day}-${month}-${year}`;
        }
    }

    const houston12Hour = convertTo12HourFormat(houstonDate.getHours(), houstonDate.getMinutes(), houstonDate.getSeconds());
    document.getElementById("houstonDay").textContent = formatDate(houstonDate, "houston");
    document.getElementById("houstonClock").textContent = houstonDate.toLocaleTimeString();
    document.getElementById("houstonDay2").textContent = formatDate(houstonDate, "houston");
    document.getElementById("Now-date-in-TX").textContent = formatDate(houstonDate, "houston");
    document.getElementById("houstonClock2").textContent = houstonDate.toLocaleTimeString();
    document.getElementById("Now-time-in-TX").textContent = houston12Hour;

    document.getElementById("hcmDay").textContent = formatDate(hcmDate, "hcm");
    document.getElementById("hcmClock").textContent = hcmDate.toLocaleTimeString();
    document.getElementById("hcmDay2").textContent = formatDate(hcmDate, "hcm");
    document.getElementById("hcmClock2").textContent = hcmDate.toLocaleTimeString();

    document.getElementById("VicDay2").textContent = formatDate(vicDate, "vic");
    document.getElementById("VicClock2").textContent = vicDate.toLocaleTimeString();
}


setInterval(updateClocks, 1000);

updateClocks();




//tính toán
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("input-Current-store-time").addEventListener("change", updateStoreTime);
    document.getElementById("Now-hour-time-in-store").addEventListener("change", updateStoreTime);
    document.getElementById("store-am-pm").addEventListener("change", updateStoreTime);
    document.getElementById("input-Time-chosen-by-customer").addEventListener("change", updateCustomerTime);
    document.getElementById("hour-time-they-choose").addEventListener("change", updateCustomerTime);
    document.getElementById("customer-am-pm").addEventListener("change", updateCustomerTime);
    document.getElementById("input-Current-store-time").addEventListener("change", calculateTimeDifference);
    document.getElementById("Now-hour-time-in-store").addEventListener("change", calculateTimeDifference);
    document.getElementById("store-am-pm").addEventListener("change", calculateTimeDifference);
});

function updateStoreTime() {
    const dateInput = document.getElementById("input-Current-store-time").value;
    const hourInput = document.getElementById("Now-hour-time-in-store").value;
    const ampm = document.getElementById("store-am-pm").value;

    // Kiểm tra nếu có đủ thông tin
    if (dateInput && hourInput && ampm) {
        // Tạo đối tượng Date từ ngày đầu vào và sử dụng múi giờ địa phương
        const date = new Date(dateInput + "T00:00:00");  // Tạo ngày từ input, mặc định là 00:00 theo múi giờ địa phương

        let hour = parseInt(hourInput);

        // Cộng thêm 12 giờ nếu là PM
        if (ampm === "PM" && hour !== 12) {
            hour += 12;
        }

        // Đảm bảo giờ không phải là 12AM
        if (ampm === "AM" && hour === 12) {
            hour = 0;
        }

        // Cập nhật giờ cho đối tượng Date, xử lý múi giờ địa phương
        date.setHours(hour);  // Sử dụng setHours để đảm bảo múi giờ địa phương

        // Định dạng ngày và giờ theo mẫu yêu cầu (ngày theo "DD-MM-YYYY" và chỉ giờ AM/PM)
        const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', optionsDate);
        const hour12 = (hour % 12 || 12);  // Chuyển đổi giờ 24h sang 12h
        const formattedTime = `${formattedDate}, ${hour12} ${ampm}`;

        // Cập nhật giá trị hiển thị cho Current-store-time
        document.getElementById("Current-store-time").textContent = formattedTime;
    }
}

function updateTexasTime() {
    // Lấy thời gian hiện tại ở Texas (múi giờ của Texas là UTC -6 hoặc UTC -5 vào mùa hè)
    const texasTime = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });

    // Tạo đối tượng Date từ thời gian hiện tại ở Texas
    const dateInTX = new Date(texasTime);

    // Định dạng ngày và giờ cho phần tử #Now-date-in-TX và #Now-time-in-TX
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = dateInTX.toLocaleDateString('en-US', optionsDate);

    const optionsTime = { hour: '2-digit', hour12: true };
    let formattedTime = dateInTX.toLocaleTimeString('en-US', optionsTime);

    // Loại bỏ khoảng cách giữa giờ và AM/PM (nếu có)
    formattedTime = formattedTime.replace(/ /g, '');

    // Cập nhật các phần tử #Now-date-in-TX và #Now-time-in-TX
    document.getElementById("Now-date-in-TX").textContent = formattedDate;
    document.getElementById("Now-time-in-TX").textContent = formattedTime;

    // Ghép lại và đưa vào #Now-in-TX
    const formattedNow = `${formattedDate}, ${formattedTime}`;
    document.getElementById("Now-in-TX").textContent = formattedNow;
}

// Gọi hàm updateTexasTime để cập nhật thời gian lúc load trang
updateTexasTime();

function updateCustomerTime() {
    const dateInput = document.getElementById("input-Time-chosen-by-customer").value;
    const hourInput = document.getElementById("hour-time-they-choose").value;
    const ampm = document.getElementById("customer-am-pm").value;

    // Kiểm tra nếu có đủ thông tin
    if (dateInput && hourInput && ampm) {
        // Tạo đối tượng Date từ ngày đầu vào và ép nó thành UTC để tránh lỗi múi giờ
        const date = new Date(dateInput + "T00:00:00"); // Tạo ngày 16/02/2025 ở múi giờ UTC

        let hour = parseInt(hourInput);

        // Cộng thêm 12 giờ nếu là PM
        if (ampm === "PM" && hour !== 12) {
            hour += 12;
        }

        // Đảm bảo giờ không phải là 12AM
        if (ampm === "AM" && hour === 12) {
            hour = 0;
        }

        // Cập nhật giờ cho đối tượng Date
        date.setHours(hour);

        // Định dạng ngày và giờ theo mẫu yêu cầu (ngày theo "DD-MM-YYYY" và chỉ giờ AM/PM)
        const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', optionsDate);
        const hour12 = (hour % 12 || 12);  // Chuyển đổi giờ 24h sang 12h
        const formattedTime = `${formattedDate}, ${hour12} ${ampm}`;

        // Cập nhật giá trị hiển thị cho Current-store-time
        document.getElementById("Date-Time-chosen-by-customer").textContent = formattedTime;
    }
}


function calculateTimeDifference() {
    // Lấy giá trị từ phần tử #Current-store-time và #Now-in-TX
    const currentStoreTime = document.getElementById("Current-store-time").textContent;
    const nowInTX = document.getElementById("Now-in-TX").textContent;

    if (currentStoreTime && nowInTX) {
        // Chuyển đổi chuỗi thời gian của Current-store-time và Now-in-TX sang đối tượng Date
        const currentStoreDate = parseDate(currentStoreTime);
        const texasTimeDate = parseDate(nowInTX);

        // Tính toán sự chênh lệch giữa hai thời gian
        const diffInMilliseconds = currentStoreDate - texasTimeDate;

        // Chuyển đổi sự chênh lệch thành giờ và phút
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

        // Cập nhật #chech-lech-gio với kết quả
        document.getElementById("chech-lech-gio").textContent = `${diffInHours}`;
    }
}

function parseDate(timeString) {
    const [datePart, timePart] = timeString.split(', ');
    const [month, day, year] = datePart.split('/').map(num => parseInt(num, 10));
    let [hour, minute] = timePart.split(':');
    const period = timePart.slice(-2);

    // Điều chỉnh giờ theo AM/PM
    if (period === 'PM' && hour !== '12') {
        hour = parseInt(hour, 10) + 12;
    } else if (period === 'AM' && hour === '12') {
        hour = 0;
    } else {
        hour = parseInt(hour, 10);
    }

    // Tạo đối tượng Date từ thông tin đã phân tích
    return new Date(year, month - 1, day, hour, minute || 0);
}



function calculateAppointmentTime() {
    // Lấy giá trị từ #Date-Time-chosen-by-customer và #chech-lech-gio
    const chosenTime = document.getElementById("Date-Time-chosen-by-customer").textContent;
    const timeDifferenceText = document.getElementById("chech-lech-gio").textContent;

    console.log("Chosen Time:", chosenTime); // Log thời gian khách hàng đã chọn
    console.log("Time Difference:", timeDifferenceText); // Log sự chênh lệch thời gian

    if (chosenTime && timeDifferenceText) {
        // Phân tích thời gian đã chọn (mm/dd/yyyy, h AM/PM)
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4}), (\d{1,2}) (\w{2})$/;
        const match = chosenTime.match(dateRegex);

        if (match) {
            const month = parseInt(match[1], 10) - 1;  // Tháng trong Date() bắt đầu từ 0
            const day = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);
            let hour = parseInt(match[4], 10);
            const ampm = match[5];

            // Đảm bảo giờ không phải là 12AM
            if (ampm === "AM" && hour === 12) {
                hour = 0;
            } else if (ampm === "PM" && hour !== 12) {
                hour += 12;  // Cộng thêm 12 giờ nếu là PM
            }

            // Tạo đối tượng Date từ thông tin đã phân tích
            let customerDate = new Date(year, month, day, hour);

            console.log("Initial Date:", customerDate); // Log đối tượng Date ban đầu

            // Phân tích #chech-lech-gio để lấy số giờ
            const hoursDifference = parseInt(timeDifferenceText, 10);

            console.log("Hours Difference:", hoursDifference); // Log số giờ chênh lệch

            // Trừ đi số giờ từ thời gian đã chọn
            customerDate.setHours(customerDate.getHours() - hoursDifference); // Cộng hoặc trừ giờ

            console.log("Updated Date:", customerDate); // Log đối tượng Date sau khi trừ thời gian

            // Định dạng lại ngày theo yêu cầu "Sun, 16-02-2025"
            const optionsDate = { 
                weekday: 'short', // Tên ngày trong tuần (Sun, Mon, ...)
                day: '2-digit',   // Ngày theo định dạng 2 chữ số
                month: '2-digit', // Tháng theo định dạng 2 chữ số
                year: 'numeric'   // Năm theo định dạng đầy đủ
            };
            let formattedDate = customerDate.toLocaleDateString('en-GB', optionsDate);

            // Thay dấu '/' thành '-'
            formattedDate = formattedDate.replace(/\//g, '-');

            // Định dạng lại giờ theo yêu cầu "h AM/PM"
            const formattedTime = customerDate.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true });

            console.log("Formatted Date:", formattedDate); // Log ngày đã định dạng
            console.log("Formatted Time:", formattedTime); // Log giờ đã định dạng

            // Cập nhật phần tử #date-right-appointments-in-TX và #time-right-appointments-in-TX
            document.getElementById("date-right-appointments-in-TX").textContent = formattedDate;
            document.getElementById("time-right-appointments-in-TX").textContent = formattedTime;
        }
    }
}



// function calculateAppointmentTime() {
//     // Step 1: Extract values from the inputs
//     let storeHour = parseInt(document.getElementById("Now-hour-time-in-store").value);
//     let storeAmPm = document.getElementById("store-am-pm").value;

//     let customerHour = parseInt(document.getElementById("hour-time-they-choose").value);
//     let customerAmPm = document.getElementById("customer-am-pm").value;

//     // Step 2: Convert store time to 24-hour format (ignore minutes)
//     if (storeAmPm === "PM" && storeHour !== 12) {
//         storeHour += 12;
//     } else if (storeAmPm === "AM" && storeHour === 12) {
//         storeHour = 0;
//     }

//     // Convert customer time to 24-hour format (ignore minutes)
//     if (customerAmPm === "PM" && customerHour !== 12) {
//         customerHour += 12;
//     } else if (customerAmPm === "AM" && customerHour === 12) {
//         customerHour = 0;
//     }

//     // Step 3: Get the current Texas time from the page (in 12-hour format)
//     let texasTime = document.getElementById("Now-time-in-TX").innerText;
//     let texasAmPm = texasTime.split(" ")[1]; // AM or PM
//     let texasHour = parseInt(texasTime.split(":")[0]);

//     // Convert Texas time from 12-hour to 24-hour format (ignore minutes)
//     if (texasAmPm === "PM" && texasHour !== 12) {
//         texasHour += 12;
//     } else if (texasAmPm === "AM" && texasHour === 12) {
//         texasHour = 0;
//     }

//     // Step 4: Calculate the difference between store time and Texas time
//     let storeTimeInHours = storeHour;
//     let texasTimeInHours = texasHour;

//     // Calculate the difference, ensuring the time difference is positive
//     let timeDifference = texasTimeInHours - storeTimeInHours;

//     if (timeDifference < 0) {
//         // If the time difference is negative (i.e., Texas time is earlier), adjust by adding 24 hours
//         timeDifference += 24;
//     }

//     // Step 5: Adjust customer's time based on the time difference
//     let adjustedCustomerTimeInTexas = (customerHour + timeDifference) % 24;

//     // Convert adjusted time back to 12-hour format
//     let adjustedCustomerAmPm = adjustedCustomerTimeInTexas >= 12 ? "PM" : "AM";
//     if (adjustedCustomerTimeInTexas > 12) {
//         adjustedCustomerTimeInTexas -= 12;
//     } else if (adjustedCustomerTimeInTexas === 0) {
//         adjustedCustomerTimeInTexas = 12;
//     }

//     // Step 6: Display the appointment time in Texas time
//     document.getElementById("time-right-appointments-in-TX").innerText = `${adjustedCustomerTimeInTexas} ${adjustedCustomerAmPm}`;
// }




//Đóng tất cả các header-container
document.addEventListener('click', function(event) {
    const headerMainContainer = document.querySelector('#header-main-container');
    const checkboxes = headerMainContainer.querySelectorAll('#header-main-container > div > input[type="checkbox"]');

    // Kiểm tra nếu người dùng bấm bên ngoài #header-main-container
    if (!headerMainContainer.contains(event.target)) {
        // Bỏ chọn tất cả các checkbox
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    } else {
        // Nếu bấm vào một checkbox
        const clickedCheckbox = event.target.closest('input[type="checkbox"]');
        if (clickedCheckbox && !clickedCheckbox.classList.contains('theme-switch__checkbox')) {
            // Bỏ chọn tất cả các checkbox khác, trừ checkbox vừa bấm
            checkboxes.forEach(checkbox => {
                if (checkbox !== clickedCheckbox && !checkbox.classList.contains('theme-switch__checkbox')) {
                    checkbox.checked = false;
                }
            });
        }
    }
});


// Chuyển qua lại dark mode và light mode
const themeSwitchCheckbox = document.querySelector('.theme-switch__checkbox');
const sunMoonIcon = document.getElementById('Sun-Moon_icon_ID');
const iframeOnboard = document.getElementById('iframe-onboard'); // Lấy iframe

// Kiểm tra và thiết lập trạng thái ban đầu
if (localStorage.getItem('darkMode') === 'enabled') {
    document.documentElement.classList.toggle('dark-mode');
    themeSwitchCheckbox.checked = true;
    sunMoonIcon.className = 'moon-and-shadow-icon';
    if (iframeOnboard) iframeOnboard.style.filter = 'invert(100%) brightness(2)'; // Nghịch màu iframe
} else {
    sunMoonIcon.className = 'sun-and-glow-icon';
    if (iframeOnboard) iframeOnboard.style.filter = ''; // Bỏ nghịch màu
}

// Lắng nghe sự kiện thay đổi chế độ sáng/tối
themeSwitchCheckbox.addEventListener('change', function () {
    if (this.checked) {
        document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        sunMoonIcon.className = 'moon-and-shadow-icon';
        if (iframeOnboard) iframeOnboard.style.filter = 'invert(100%) brightness(2)'; // Nghịch màu iframe
    } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        sunMoonIcon.className = 'sun-and-glow-icon';
        if (iframeOnboard) iframeOnboard.style.filter = ''; // Bỏ nghịch màu
    }
});




// Di chuyển các containter Tools
document.querySelectorAll('.movearea').forEach(movearea => {
    movearea.addEventListener('mousedown', function (e) {
        const parent = this.parentElement;

        const computedStyle = window.getComputedStyle(parent);
        if (!parent.style.width) {
            parent.style.width = computedStyle.width; // Lấy kích thước thực tế
        }
        if (!parent.style.height) {
            parent.style.height = computedStyle.height;
        }

        const rect = parent.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        function onMouseMove(event) {
            // Đặt phần tử cha ở giữa con chuột
            parent.style.left = `${event.clientX - 0}px`;
            parent.style.top = `${event.clientY - 20}px`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
});

