/**
 * IT MART - LOYALTY & VIP MEMBERSHIP SYSTEM (loyalty.js)
 * Tích lũy điểm thưởng khi mua sắm (10.000đ = 1 điểm) & Thăng hạng thẻ thành viên VIP
 */

const LoyaltySystem = {
    tiers: [
        { id: "bronze", name: "Thành Viên Đồng", minPoints: 0, maxPoints: 99, discount: 0, color: "#cd7f32", icon: "fa-award", perk: "Tích 1% điểm mỗi hóa đơn" },
        { id: "silver", name: "Thành Viên Bạc", minPoints: 100, maxPoints: 499, discount: 0, color: "#94a3b8", icon: "fa-medal", perk: "Tặng Voucher 5% sinh nhật + Ưu tiên giao 2h" },
        { id: "gold", name: "Thành Viên Vàng (VIP)", minPoints: 500, maxPoints: 999, discount: 2, color: "#f59e0b", icon: "fa-crown", perk: "Tự động giảm 2% trên mọi đơn hàng" },
        { id: "diamond", name: "Thành Viên Kim Cương (VVIP)", minPoints: 1000, maxPoints: 999999, discount: 5, color: "#38bdf8", icon: "fa-gem", perk: "Tự động giảm 5% + Miễn phí vận chuyển mọi đơn" }
    ],

    getUser() {
        try {
            const user = JSON.parse(localStorage.getItem("itmart_user"));
            return (user && user.isLoggedIn) ? user : null;
        } catch (e) {
            return null;
        }
    },

    getUserPoints() {
        const user = this.getUser();
        if (!user) return 0;
        return user.points || 120; // Mặc định tặng 120 điểm chào mừng
    },

    getCurrentTier(points) {
        const p = points !== undefined ? points : this.getUserPoints();
        for (let i = this.tiers.length - 1; i >= 0; i--) {
            if (p >= this.tiers[i].minPoints) {
                return this.tiers[i];
            }
        }
        return this.tiers[0];
    },

    getNextTier(currentTier) {
        const idx = this.tiers.findIndex(t => t.id === currentTier.id);
        if (idx < this.tiers.length - 1) {
            return this.tiers[idx + 1];
        }
        return null;
    },

    // Cộng điểm khi đặt hàng thành công (10.000đ = 1 điểm)
    addPoints(amount) {
        const user = this.getUser();
        if (!user) return 0;

        const earned = Math.floor(amount / 10000);
        user.points = (user.points || 120) + earned;
        localStorage.setItem("itmart_user", JSON.stringify(user));
        return earned;
    },

    // Hiển thị thẻ VIP Member trong User Profile Modal
    renderProfileCard(container) {
        const user = this.getUser();
        if (!user || !container) return;

        const points = this.getUserPoints();
        const tier = this.getCurrentTier(points);
        const nextTier = this.getNextTier(tier);

        let progressPercent = 100;
        let pointsNeeded = 0;
        if (nextTier) {
            const range = nextTier.minPoints - tier.minPoints;
            const current = points - tier.minPoints;
            progressPercent = Math.min(100, Math.max(0, Math.round((current / range) * 100)));
            pointsNeeded = nextTier.minPoints - points;
        }

        const cardHtml = `
            <div class="loyalty-vip-card tier-${tier.id}">
                <div class="vip-card-header">
                    <div class="vip-card-brand">
                        <i class="fa-solid fa-store"></i> IT MART REWARDS
                    </div>
                    <div class="vip-tier-badge">
                        <i class="fa-solid ${tier.icon}"></i> ${tier.name}
                    </div>
                </div>

                <div class="vip-card-body">
                    <div class="vip-points-count">
                        <span class="points-num">${points.toLocaleString("vi-VN")}</span>
                        <span class="points-label">Điểm tích lũy</span>
                    </div>
                    <div class="vip-card-perk">
                        <i class="fa-solid fa-gift"></i> ${tier.perk}
                    </div>
                </div>

                <div class="vip-progress-box">
                    <div class="vip-progress-labels">
                        <span>Hạng hiện tại: <strong>${tier.name}</strong></span>
                        <span>${nextTier ? `Còn <strong>${pointsNeeded} điểm</strong> lên ${nextTier.name}` : 'Hạng cao nhất!'}</span>
                    </div>
                    <div class="vip-progress-track">
                        <div class="vip-progress-bar" style="width: ${progressPercent}%;"></div>
                    </div>
                </div>
            </div>
        `;

        const existing = container.querySelector(".loyalty-vip-card");
        if (existing) existing.remove();

        const avatarGrid = container.querySelector(".profile-info-grid");
        if (avatarGrid) {
            avatarGrid.insertAdjacentHTML("afterend", cardHtml);
        } else {
            container.insertAdjacentHTML("afterbegin", cardHtml);
        }
    }
};

window.LoyaltySystem = LoyaltySystem;
