"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const roomsCartSection = document.querySelector(".room-card-full-width-section");
  const paginationContainer = document.querySelector(".pagination");

  let currentPage = 1;
  const itemsPerPage = 20;
  let allRooms = [];

  async function getRooms() {
    try {
      if (!roomsCartSection) {
        console.error("المان .room-card-full-width-section پیدا نشد");
        return;
      }

      const res = await fetch("http://localhost:3000/rooms");
      if (!res.ok) throw new Error("خطا در دریافت اتاق‌ها");

      const data = await res.json();
      allRooms = data;

      renderRooms(currentPage);
      renderPagination();
    } catch (error) {
      console.error("خطا در دریافت اتاق‌ها:", error.message);
      roomsCartSection.innerHTML = `<p>خطا در بارگذاری اطلاعات</p>`;
    }
  }

  function renderRooms(page) {
    roomsCartSection.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const roomsToShow = allRooms.slice(start, end);

    roomsToShow.forEach((room) => {
      roomsCartSection.innerHTML += `
        <div class="room-card-full-width">
          <img src="${room.image}" class="room-card-full-width-img" alt="${room.roomName}">
          
          <div class="room-items-section-and-title">
            <h2>${room.roomName}</h2>
            <div>
              <span class="room-items">like: ${room.like}</span>
            </div>
          </div>

          <div class="room-price-and-btn-in-all-rooms-page">
            <a href="/parsa/Page/products.html?id=${room.id}" class="room-price-btn">اطلاعات بیشتر</a>
            <p class="room-price">${room.price} تومان</p>
          </div>
        </div>
      `;
    });
  }

  function renderPagination() {
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(allRooms.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      paginationContainer.innerHTML += `
        <button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    document.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentPage = Number(btn.dataset.page);
        renderRooms(currentPage);
        renderPagination();
      });
    });
  }

  getRooms();
});
