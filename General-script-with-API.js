// đăng ký the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
    });
}




// Sửa lại giá trị của ô A1 trong Sheet "Lich Truc (copy)"
document.getElementById('updateA1Btn').addEventListener('click', function () {
    // Lấy giá trị từ các input
    var sheetName = document.getElementById('sua-ten-sheet').value;
    var cellReference = document.getElementById('sua-o-dau-tien-trong-sheet').value;
    var lastcellReference = document.getElementById('sua-o-cuoi-cung-trong-sheet').value;
    var statusContainer = document.getElementById('status-of-updating-lichtruc-container');
    var loaderupdatelichtruc = document.getElementById('loader-update-lichtruc');
    var updateidlichtruc = document.getElementById('update-id-lichtruc');

    // Xóa thông báo cũ
    statusContainer.innerHTML = '';

    if (!sheetName || !cellReference || !lastcellReference) {
        statusContainer.innerHTML = "Vui lòng nhập đầy đủ thông tin.";
        statusContainer.style.backgroundColor = 'red';
        statusContainer.style.color = 'white';
        autoHideStatus();
        return;
    }

    // Hiện loader trong lúc chờ
    updateidlichtruc.classList.add('hidden');
    loaderupdatelichtruc.classList.remove('hidden');

    // Tạo công thức IMPORTRANGE
    var formula = '=IMPORTRANGE("1s2a2QqSHId1XKQTW2dSoBcQ-aBNBiF54VtNKMMZ_ADQ", "\'' + sheetName + '\'!' + cellReference + '\:' + lastcellReference + '")';

    // URL script đã cung cấp
    var scriptURL = 'https://script.google.com/macros/s/AKfycbxy2wam-fhMZKGwB5LrJWTT-sCzpCytwZhUIcjBhmx9SojWSuAwVudAPCRx0CN7488/exec';

    var data = {
        action: 'editA1-trong-lich-truc-copy',
        value: formula
    };

    // Gửi POST request đến Google Apps Script
    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
    })
        .then(response => response.text())
        .then(data => {
            refreshLichTruc();
        })
        .catch(error => {
            console.error('Error:', error);
            // Hiển thị thông báo khi gặp lỗi
            statusContainer.innerHTML = "Đã có lỗi xảy ra: " + error.message + "";
            statusContainer.style.backgroundColor = 'red';
            statusContainer.style.color = 'white';
            autoHideStatus();
        })
        .finally(() => {
            // Ẩn loader sau khi hoàn thành hoặc gặp lỗi
            loaderupdatelichtruc.classList.add('hidden');
            updateidlichtruc.classList.remove('hidden');
        });

    // Hàm tự động ẩn thông báo sau 3 giây
    function autoHideStatus() {
        setTimeout(function () {
            statusContainer.innerHTML = "";
            statusContainer.style.backgroundColor = '';
            statusContainer.style.color = '';

        }, 3000); // Ẩn sau 3 giây
    }
});



// Hiển thị Lịch trực cuối tuần
fetch('https://script.google.com/macros/s/AKfycbxy2wam-fhMZKGwB5LrJWTT-sCzpCytwZhUIcjBhmx9SojWSuAwVudAPCRx0CN7488/exec?action=getLichTrucCopy', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
    .then(response => response.json()) // Dữ liệu trả về sẽ là JSON
    .then(data => {
        // Tạo bảng từ dữ liệu
        var table = '<table border="1" cellpadding="5" cellspacing="0">';

        // Tạo tiêu đề bảng (dòng đầu tiên là tiêu đề cột)
        table += '<thead style="z-index:10;"><tr>';
        if (data.length > 0) {
            for (var i = 0; i < data[0].length; i++) {
                if (i === 0) {
                    table += '<th>' + data[0][i] + '</th>';
                } else {
                    table += '<th><div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 1rem"><div class="white-delete-icon"></div><span>' + data[0][i] + '</span></div></th>';
                }
            }
            table += '</tr></thead>';
        }

        // Tạo nội dung bảng
        table += '<tbody>';
        for (var i = 1; i < data.length; i++) {
            table += '<tr>';
            for (var j = 0; j < data[i].length; j++) {
                if (j === 0) {
                    table += '<td style="padding: 0; margin: 0;"><div style="display: flex; align-items: center; justify-content: space-between;"><div class="white-delete-icon"></div><span style="flex: 1;">' + data[i][j] + '</span></div></td>';
                } else {
                    table += '<td>' + data[i][j] + '</td>';
                }
            }
            table += '</tr>';
        }
        table += '</tbody>';

        table += '</table>';

        // Hiển thị bảng trong div
        document.getElementById('lich-truc-cuoi-tuan-view').innerHTML = table;

        // Thêm chức năng cho các white-delete-icon
        addDeleteIconFunctions();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('lich-truc-cuoi-tuan-view').innerHTML = 'Lỗi khi tải dữ liệu.';
    });

function addDeleteIconFunctions() {
    // Gắn data-index cho các th
    document.querySelectorAll('thead th').forEach((th, index) => {
        th.setAttribute('data-index', index);
    });

    // Ẩn cột khi click white-delete-icon trong <th>
    const thIcons = document.querySelectorAll('thead .white-delete-icon');
    thIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const th = icon.closest('th');
            const colIndex = th.getAttribute('data-index'); // Lấy chỉ số cột từ data-index

            // Ẩn cột <th>
            th.style.display = 'none';

            // Ẩn tất cả <td> trong cột tương ứng
            document.querySelectorAll(`tbody tr`).forEach(row => {
                const td = row.querySelectorAll('td')[colIndex];
                if (td) td.style.display = 'none';
            });
        });
    });

    // Ẩn hàng khi click white-delete-icon trong <td>
    const tdIcons = document.querySelectorAll('tbody .white-delete-icon');
    tdIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const tr = icon.closest('tr');
            if (tr) tr.style.display = 'none'; // Ẩn hàng
        });
    });
}

// Nút Show All
document.getElementById('Show-all-in-lichtruc-container').addEventListener('click', function () {
    // Hiện tất cả các cột và hàng trong bảng
    document.querySelectorAll('thead th').forEach(th => {
        th.style.display = 'table-cell'; // Hiện cột tiêu đề
    });

    document.querySelectorAll('tbody td').forEach(row => {
        row.style.display = 'table-cell'; // Hiện các hàng trong bảng
    });

    document.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = 'table-row'; // Hiện các hàng trong bảng
    });


    var statusContainer = document.getElementById('status-of-updating-lichtruc-container');
    statusContainer.innerHTML = "Đã hiện tất cả";
    statusContainer.style.backgroundColor = 'green';
    statusContainer.style.color = 'white';
    setTimeout(function () {
        statusContainer.innerHTML = "";
        statusContainer.style.backgroundColor = '';
        statusContainer.style.color = '';
    }, 3000);
});



// Nút refresh
function refreshLichTruc() {
    const targetView = document.getElementById('lich-truc-cuoi-tuan-view');
    const statusContainer = document.getElementById('status-of-updating-lichtruc-container');
    const loaderlichtruc = document.getElementById('loader-lichtruc');

    // Hiển thị loader & xóa nội dung cũ trước khi fetch
    loaderlichtruc.classList.remove('hidden');
    targetView.innerHTML = "";

    console.log("🔄 Đang tải dữ liệu...");

    // Gọi fetch dữ liệu từ Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbxy2wam-fhMZKGwB5LrJWTT-sCzpCytwZhUIcjBhmx9SojWSuAwVudAPCRx0CN7488/exec?action=getLichTrucCopy', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Dữ liệu đã nhận:", data);

            // Kiểm tra nếu dữ liệu rỗng
            if (!data || data.length === 0) {
                targetView.innerHTML = "<p>Không có dữ liệu.</p>";
                return;
            }

            // Tạo bảng từ dữ liệu
            let table = '<table border="1" cellpadding="5" cellspacing="0">';

            table += '<thead style="z-index:10;"><tr>';
            for (let i = 0; i < data[0].length; i++) {
                if (i === 0) {
                    table += `<th>${data[0][i]}</th>`;
                } else {
                    table += `<th><div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 1rem"><div class="white-delete-icon"></div><span>${data[0][i]}</span></div></th>`;
                }
            }
            table += '</tr></thead>';

            table += '<tbody>';
            for (let i = 1; i < data.length; i++) {
                table += '<tr>';
                for (let j = 0; j < data[i].length; j++) {
                    if (j === 0) {
                        table += `<td style="padding: 0; margin: 0;"><div style="display: flex; align-items: center; justify-content: space-between;"><div class="white-delete-icon"></div><span style="flex: 1;">${data[i][j]}</span></div></td>`;
                    } else {
                        table += `<td>${data[i][j]}</td>`;
                    }
                }
                table += '</tr>';
            }
            table += '</tbody>';
            table += '</table>';

            // Cập nhật giao diện
            targetView.innerHTML = table;

            addDeleteIconFunctions();
        })
        .catch(error => {
            console.error("❌ Lỗi khi tải dữ liệu:", error);
            targetView.innerHTML = `<p style="color: red;">Lỗi khi tải dữ liệu: ${error.message}</p>`;
        })
        .finally(() => {
            // Ẩn loader khi hoàn tất
            loaderlichtruc.classList.add('hidden');

            // Hiển thị thông báo cập nhật thành công
            statusContainer.innerHTML = "Đã cập nhật xong";
            statusContainer.style.backgroundColor = 'green';
            statusContainer.style.color = 'white';

            // Tự động ẩn thông báo sau 3 giây
            setTimeout(() => {
                statusContainer.innerHTML = "";
                statusContainer.style.backgroundColor = '';
                statusContainer.style.color = '';
            }, 3000);
        });
}







function fetchSMSData() {
    const url = 'https://script.google.com/macros/s/AKfycbxy2wam-fhMZKGwB5LrJWTT-sCzpCytwZhUIcjBhmx9SojWSuAwVudAPCRx0CN7488/exec?action=getSMSData'; // Updated URL
    const params = {}; // No need to pass action in params since it's already in the URL

    // Gửi yêu cầu GET tới backend
    fetch(url, {
        method: 'GET',  // Changed method to GET
    })
        .then(response => response.json())  // Chuyển dữ liệu từ JSON
        .then(data => renderSMSData(data))  // Xử lý và hiển thị dữ liệu
        .catch(error => console.error('Error fetching data:', error));
}


fetchSMSData();

function renderSMSData(data) {
    const container = document.getElementById('fetchSMSFromManagers');

    // Hàm để gom nhóm dữ liệu theo cột A
    function groupBy(data, columnIndex) {
        return data.reduce((groups, item) => {
            const key = item[columnIndex];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
    }

    // Hàm để chuyển đổi ký tự có dấu thành không dấu
    function removeAccents(str) {
        var accents = 'ÀÁÂÃĂẠẢẤẦẨẪẬẮẰẲẴẶàáâãăạảấầẩẫậắằẳẵặĐđÝỲỴỶỸýỳỵỷỹÌÍĨỈỊìíĩỉịÙÚŨƯỤỦỨỪỬỮỰùúũưụủứừửữựÒÓÔÕƠỌỎỐỒỔỖỘỚỜỞỠỢòóôõơọỏốồổỗộớờởỡợÈÉÊẸẺẼẾỀỂỄỆèéêẹẻẽếềểễệ';
        var accentsOut = 'AAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaDdYYYYYyyyyyIIIIIiiiiiUUUUUUUUUUUuuuuuuuuuuuOOOOOOOOOOOOOOOOOoooooooooooooooooEEEEEEEEEEEeeeeeeeeeee';

        return str.split('').map(function (char) {
            var index = accents.indexOf(char);
            return index !== -1 ? accentsOut.charAt(index) : char;
        }).join('');
    }

    // Sắp xếp dữ liệu theo cột A để gom nhóm
    const groupedData = groupBy(data, 1); // Sắp xếp theo cột A (index 0)

    // Tạo nhóm DOM
    for (const group in groupedData) {
        const columnB = document.createElement('div');
        columnB.classList.add('columnB'); // Thêm lớp cho nhóm
        columnB.setAttribute('data-group-title', group);

        const columngroupC = document.createElement('div');
        columngroupC.classList.add('columngroupC');

        let createdInput = false; // Cờ để kiểm tra xem đã tạo input chưa

        // Thêm các cột B và C tương ứng dưới cột A
        groupedData[group].forEach(item => {
            const columnC = document.createElement('div');
            columnC.classList.add('columnC');
            columnC.innerText = item[2]; // Cột B (index 1)

            // Thay đổi columnD thành <span> thay vì <div>
            const columnD = document.createElement('span');
            columnD.classList.add('columnD');
            columnD.style.display = 'none';
            columnD.innerText = item[3]; // Cột C (index 2)
            columnD.setAttribute('data-original', item[3]);

            // Gắn sự kiện click để copy nội dung columnD
            columnC.addEventListener('click', () => {
                const originalText = columnC.innerText; // Lưu nội dung ban đầu
                const contentToCopy = columnD.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();

                navigator.clipboard.writeText(contentToCopy).then(() => {
                    columnC.innerText = 'Copied'; // Đổi nội dung thành "Copied"
                    columnC.style.color = 'red';
                    columnC.style.backgroundColor = 'yellow';
                    // Sau 3 giây, khôi phục nội dung ban đầu
                    setTimeout(() => {
                        columnC.innerText = originalText;
                        columnC.style.color = '';
                        columnC.style.backgroundColor = '';
                    }, 3000); // 3000 ms = 3 giây
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });



            // Nếu item[0] bằng "Có" và chưa tạo input, tạo 1 input cho nhóm này
            if (item[0] === "Có" && !createdInput) {
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.placeholder = 'Your Name';
                inputField.classList.add('columnA'); // Thêm lớp CSS nếu cần
                columnB.appendChild(inputField);
                createdInput = true; // Đánh dấu đã tạo input cho nhóm này

                // Gắn sự kiện cho inputField
                inputField.addEventListener('input', function () {
                    let value = inputField.value;

                    // Chuyển đổi value thành không dấu
                    let value2 = removeAccents(value);

                    // Lặp qua tất cả các columnD trong nhóm và cập nhật nội dung
                    columngroupC.querySelectorAll('.columnD').forEach(columnD => {
                        let originalText = columnD.getAttribute('data-original'); // Lấy giá trị gốc
                        columnD.innerText = originalText.replace('***', value).replace('---', value2);
                    });
                });
            }

            columnC.appendChild(columnD);
            columngroupC.appendChild(columnC);
        });

        columnB.appendChild(columngroupC);

        // Thêm nhóm vào container
        container.appendChild(columnB);
    }
}



fetchAndDisplayCheckIDInformation();


async function fetchAndDisplayCheckIDInformation() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxy2wam-fhMZKGwB5LrJWTT-sCzpCytwZhUIcjBhmx9SojWSuAwVudAPCRx0CN7488/exec?action=CheckIDInformation'; // Updated URL

    try {
        const response = await fetch(scriptURL, {
            method: 'GET',  // Changed method to GET since action is part of the URL
        });

        const result = await response.json();

        // Pass the fetched result to the createLinks function
        createLinks(result);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



function createLinks(result) {
    // Clear existing content
    const container = document.getElementById('fetch-check-id-information');
    container.innerHTML = '';

    result.forEach((item, index) => {
        const name = item[0];  // Name from column A
        let linkUrl = item[1];  // URL from column B

        console.log("Original Link URL:", linkUrl);

        // Create the <a> element
        const link = document.createElement('a');
        link.href = linkUrl;
        link.classList.add('Open-button');
        link.textContent = name;

        // Tạo checkbox
        const labelcheckbox = document.createElement('label');
        labelcheckbox.classList.add('checkbox-container', 'absolutecenter');

        const divcheckbox = document.createElement('div');
        divcheckbox.classList.add('checkmark');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('custom-checkbox');

        // Check localStorage to restore the state of the checkbox
        const storedState = localStorage.getItem('checkboxState' + index);
        if (storedState === 'checked') {
            input.checked = true;
        } else {
            input.checked = false;
        }

        // Add event listener to change localStorage when checkbox state changes
        input.addEventListener('change', function () {
            if (input.checked) {
                localStorage.setItem('checkboxState' + index, 'checked');
            } else {
                localStorage.setItem('checkboxState' + index, 'unchecked');
            }
        });

        const group = document.createElement('div');
        group.style.position = 'relative';
        group.appendChild(link);
        group.appendChild(labelcheckbox);

        labelcheckbox.appendChild(input);
        labelcheckbox.appendChild(divcheckbox);
    
        // Add event listener to replace "*****" and open in new tabs
        link.addEventListener('click', function (event) {
            // Prevent the default action of opening the link
            event.preventDefault();

            // Check if the checkbox is checked
            const isLockChecked = document.getElementById('lock-combo-activate').checked;
            if (isLockChecked) {
                // If checked, execute pasteClipboard and updateCheckInfo
                pasteClipboard().then(() => {
                    const customValues = document.getElementById('id-of-check-id-information')?.textContent.split(',');

                    if (customValues && customValues.length > 0) {
                        customValues.forEach(customValue => {
                            customValue = customValue.trim();
                            const modifiedLinkUrl = linkUrl.replace('*****', customValue);
                            console.log("Modified Link URL:", modifiedLinkUrl);

                            // Now open the modified link in a new tab
                            window.open(modifiedLinkUrl, '_blank');
                        });
                    } else {
                        console.log("No custom values found in span.");
                        alert("Please enter valid values in the input field.");
                    }
                });
            } else {
                // If not checked, just proceed with the link click as usual
                const customValues = document.getElementById('id-of-check-id-information')?.textContent.split(',');

                if (customValues && customValues.length > 0) {
                    customValues.forEach(customValue => {
                        customValue = customValue.trim();
                        const modifiedLinkUrl = linkUrl.replace('*****', customValue);
                        console.log("Modified Link URL:", modifiedLinkUrl);

                        window.open(modifiedLinkUrl, '_blank');
                    });
                } else {
                    console.log("No custom values found in span.");
                    alert("Please enter valid values in the input field.");
                }
            }
        });

        container.appendChild(group);
    });
}



fetchAndDisplayGetServer();

let map = {}; // Biến lưu trữ dữ liệu sau khi fetch

async function fetchAndDisplayGetServer() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxy2wam-fhMZKGwB5LrJWTT-sCzpCytwZhUIcjBhmx9SojWSuAwVudAPCRx0CN7488/exec?action=GetServer'; // Updated URL

    try {
        const response = await fetch(scriptURL, {
            method: 'GET',  // Changed method to GET since action is part of the URL
        });

        const result = await response.json();

        // Pass the fetched result to the createLinks function
        createLinksGetServer(result);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function createLinksGetServer(data) {
    const dropdown = document.getElementById("dropdown");
    dropdown.innerHTML = ""; // Clear existing options

    map = {}; // Reset map

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Click to choose Server";
    defaultOption.disabled = true; // Không cho phép chọn lại nếu đã chọn server khác
    defaultOption.selected = true; // Là tùy chọn mặc định
    dropdown.appendChild(defaultOption);

    // Add server options from data
    data.forEach((row, index) => {
        const [serverName, someValue, serverIDH] = row;

        // Populate the dropdown with server names
        const option = document.createElement("option");
        option.value = index;
        option.textContent = serverName;
        dropdown.appendChild(option);

        // Map index to server details
        map[index] = {
            name: serverName,
            someValue: someValue,
            serverIDH: serverIDH // Cột thứ 3
        };
    });
}


fetchAndDisplayGetOtherDocuments();

async function fetchAndDisplayGetOtherDocuments() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxy2wam-fhMZKGwB5LrJWTT-sCzpCytwZhUIcjBhmx9SojWSuAwVudAPCRx0CN7488/exec?action=GetOtherDocuments'; // Updated URL

    try {
        const response = await fetch(scriptURL, {
            method: 'GET',  // Changed method to GET since action is part of the URL
        });

        const result = await response.json();

        // Pass the fetched result to the createLinks function
        createLinksGetOtherDocuments(result);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function createLinksGetOtherDocuments(data) {
    // Get the container where the links will be appended
    const container = document.getElementById('fetch-other-documents'); // Ensure you have an element with this ID in your HTML
    container.innerHTML = '';
    data.forEach(row => {
        const link = document.createElement('a');

        link.textContent = row[0];
        link.href = row[1];
        link.target = '_blank';
        link.classList.add('Open-button');
        container.appendChild(link);
    });
}

fetchAndDisplayDocuments();

async function fetchAndDisplayDocuments() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxy2wam-fhMZKGwB5LrJWTT-sCzpCytwZhUIcjBhmx9SojWSuAwVudAPCRx0CN7488/exec?action=GetMoreDocuments');
        const data = await response.json();

        function convertUrlsToLinks(text) {
            var urlRegex = /(https?:\/\/[^\s<]+)/g;
            text = text.replace(urlRegex, function (url) {
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            });
            return text.replace(/\n/g, '<br>');  // Convert line breaks to <br> tags
        }

        if (Array.isArray(data) && data.length > 0) {
            const container = document.querySelector('#more-document-table');
            container.innerHTML = '';

            const table = document.createElement('table');
            const tbody = document.createElement('tbody');

            data.forEach(row => {
                const tableRow = document.createElement('tr');
                const titleCell = document.createElement('td');
                titleCell.innerHTML = convertUrlsToLinks(row[0]);
                tableRow.appendChild(titleCell);

                const dateCell = document.createElement('td');
                dateCell.innerHTML = convertUrlsToLinks(row[1]);
                tableRow.appendChild(dateCell);

                tbody.appendChild(tableRow);
            });

            table.appendChild(tbody);
            container.appendChild(table);
        } else {
            console.error('Invalid data format');
        }
    } catch (error) {
        console.error('Error fetching documents:', error);
    }
}


document.getElementById("refresh-more-documents-container").addEventListener("click", async function () {
    const statusContainer = document.getElementById('status-of-updating-more-documents-container');
    statusContainer.innerHTML = "";
    statusContainer.style.backgroundColor = '';
    statusContainer.style.color = '';

    const loader = document.getElementById('loader-more-documents');
    loader.classList.remove('hidden'); // Hiện loader

    const container = document.querySelector('#more-document-table');
    container.innerHTML = ''; // Xóa nội dung cũ

    await fetchAndDisplayDocuments(); // Chờ fetch hoàn tất

    loader.classList.add('hidden'); // Ẩn loader ngay sau khi fetch hoàn tất

    // Hiển thị thông báo cập nhật thành công
    statusContainer.innerHTML = "Đã cập nhật xong";
    statusContainer.style.backgroundColor = 'green';
    statusContainer.style.color = 'white';

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        statusContainer.innerHTML = "";
        statusContainer.style.backgroundColor = '';
        statusContainer.style.color = '';
    }, 3000);

});






fetchAndDisplayAnnoucements();

async function fetchAndDisplayAnnoucements() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxy2wam-fhMZKGwB5LrJWTT-sCzpCytwZhUIcjBhmx9SojWSuAwVudAPCRx0CN7488/exec?action=GetAnnoucements');
        const data = await response.json();

        function convertUrlsToLinks(text) {
            var urlRegex = /(https?:\/\/[^\s<]+)/g;
            text = text.replace(urlRegex, function (url) {
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            });
            return text.replace(/\n/g, '<br>');  // Convert line breaks to <br> tags
        }

        if (Array.isArray(data) && data.length > 0) {
            const container = document.querySelector('#Annoucements-table');
            container.innerHTML = '';

            const table = document.createElement('table');
            const tbody = document.createElement('tbody');

            data.forEach(row => {
                const tableRow = document.createElement('tr');
                const titleCell = document.createElement('td');
                titleCell.innerHTML = convertUrlsToLinks(row[0]);
                tableRow.appendChild(titleCell);

                tbody.appendChild(tableRow);
            });

            table.appendChild(tbody);
            container.appendChild(table);
        } else {
            console.error('Invalid data format');
        }
    } catch (error) {
        console.error('Error fetching documents:', error);
    }
}


document.getElementById("refresh-annoucement-container").addEventListener("click", async function () {
    const statusContainer = document.getElementById('status-of-updating-Annoucements_container-container');
    statusContainer.innerHTML = "";
    statusContainer.style.backgroundColor = '';
    statusContainer.style.color = '';

    const loader = document.getElementById('loader-Annoucements_container');
    loader.classList.remove('hidden'); // Hiện loader

    const container = document.querySelector('#Annoucements-table');
    container.innerHTML = ''; // Xóa nội dung cũ

    await fetchAndDisplayAnnoucements(); // Chờ fetch hoàn tất

    loader.classList.add('hidden'); // Ẩn loader ngay sau khi fetch hoàn tất

    // Hiển thị thông báo cập nhật thành công
    statusContainer.innerHTML = "Đã cập nhật xong";
    statusContainer.style.backgroundColor = 'green';
    statusContainer.style.color = 'white';

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        statusContainer.innerHTML = "";
        statusContainer.style.backgroundColor = '';
        statusContainer.style.color = '';
    }, 3000);

});
