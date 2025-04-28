document.addEventListener('DOMContentLoaded', function () {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            hienThiTongQuan(data.tong_ket);
            hienThiDanhSachGiaoDich(data.thu, 'du-lieu-thu');
            hienThiDanhSachGiaoDich(data.chi, 'du-lieu-chi');
            taoBieuDoTronThuChi(data.tong_ket);
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu:', error);
            document.getElementById('main').innerHTML = '<p class="error">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>';
        });
});

function hienThiTongQuan(tongKet) {
    document.getElementById('tong-thu-overview').textContent = formatCurrency(tongKet.tong_thu);
    document.getElementById('tong-chi-overview').textContent = formatCurrency(tongKet.tong_chi);
    document.getElementById('so-du-overview').textContent = formatCurrency(tongKet.so_du);
    if (tongKet.tong_chi > tongKet.tong_thu) {
        document.getElementById('tong-chi-overview').classList.add('negative');
    }
}

function hienThiDanhSachGiaoDich(danhSach, elementId) {
    const container = document.getElementById(elementId);
    let html = '';
    const soLuongHienThi = 5;
    const danhSachGanDay = danhSach.slice(-soLuongHienThi).reverse();

    danhSachGanDay.forEach(item => {
        html += `
            <tr>
                <td>${item.ngay}</td>
                <td>${item.nguoi_nop || item.noi_dung}</td>
                <td>${formatCurrency(item.so_tien)}</td>
                <td>${item.ghi_chu || ''}</td>
            </tr>
        `;
    });
    container.innerHTML = html;
}

function taoBieuDoTronThuChi(tongKet) {
    const ctx = document.getElementById('bieu-do-thu-chi').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Tổng Thu', 'Tổng Chi'],
            datasets: [{
                label: 'VNĐ',
                data: [tongKet.tong_thu, tongKet.tong_chi],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Tỷ Lệ Tổng Thu và Tổng Chi',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}