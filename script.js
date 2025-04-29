document.addEventListener('DOMContentLoaded', function () {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const tongKet = tinhTongKet(data.thu, data.chi);
            hienThiTongQuan(tongKet);
            hienThiDanhSachGiaoDich(data.thu, 'du-lieu-thu');
            hienThiDanhSachGiaoDich(data.chi, 'du-lieu-chi');
            taoBieuDoTronThuChi(tongKet);
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu:', error);
            document.getElementById('main').innerHTML = '<p class="error">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>';
        });
});

function tinhTongKet(thu, chi) {
    let tongThu = 0;
    thu.forEach(item => {
        tongThu += item.so_tien;
    });

    let tongChi = 0;
    chi.forEach(item => {
        tongChi += item.so_tien;
    });

    const soDu = tongThu - tongChi;

    return { tong_thu: tongThu, tong_chi: tongChi, so_du: soDu };
}

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
    const soLuongHienThi = 15;
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
            labels: ['Tổng thu', 'Tổng chi'],
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
                    text: 'Tỷ lệ Tổng thu và Tổng chi',
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