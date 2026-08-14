// Next Challenge - 공용 스크립트
// 기존에 각 페이지(index, portfolio, work, work-1/2/3, contact)마다
// 인라인으로 중복되어 있던 스크립트를 하나로 통합한 파일입니다.

document.addEventListener("DOMContentLoaded", () => {

    // 1. 상단바 스크롤 감지 (50px 이상 내려가면 .scrolled 클래스 부여)
    const header = document.querySelector('.header-nav');
    function checkHeaderScroll() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll();

    // 2. 모바일 메뉴 열기/닫기
    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const closeBtn = document.querySelector(".menu-close-btn");
    const closeZone = document.querySelector(".mobile-close-zone");
    const menuBox = document.querySelector(".menu-box");

    if (mobileBtn && menuBox) {
        mobileBtn.addEventListener("click", () => {
            menuBox.classList.add("active");
            history.pushState({ menuOpen: true }, "", "#menu");
        });
    }

    const closeMenu = () => {
        if (menuBox && menuBox.classList.contains("active")) {
            menuBox.classList.remove("active");
            if (window.location.hash === "#menu") history.back();
        }
    };

    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (closeZone) closeZone.addEventListener("click", closeMenu);
    window.addEventListener("popstate", () => {
        if (menuBox && menuBox.classList.contains("active")) menuBox.classList.remove("active");
    });

    // 3. 홈(index) 전용: 모바일에서 hero-copy를 intro-box 안으로 이동
    const heroCopy = document.querySelector('.hero-copy');
    const introBox = document.querySelector('.intro-box .container');
    if (heroCopy && introBox && window.innerWidth <= 768) {
        introBox.prepend(heroCopy);
    }

    // 4. 홈 전용 CONTACT 버튼(.hero-right-wrapper) 고정/해제 로직
    const heroBtnWrapper = document.querySelector('.hero-right-wrapper');
    if (heroBtnWrapper) {
        let isBtnFixed = false;
        window.addEventListener('scroll', () => {
            const footer = document.querySelector('.site-footer');

            if (window.scrollY > 900) {
                if (!isBtnFixed) {
                    heroBtnWrapper.classList.remove('scrolled-out');
                    heroBtnWrapper.classList.add('scrolled-fixed');
                    isBtnFixed = true;
                }
            } else {
                if (isBtnFixed) {
                    heroBtnWrapper.classList.remove('scrolled-fixed');
                    heroBtnWrapper.classList.add('scrolled-out');
                    isBtnFixed = false;
                    setTimeout(() => {
                        if (window.scrollY <= 1000) heroBtnWrapper.classList.remove('scrolled-out');
                    }, 50);
                }
            }

            if (footer && heroBtnWrapper.classList.contains('scrolled-fixed')) {
                const overlap = window.innerHeight - footer.getBoundingClientRect().top;
                heroBtnWrapper.style.marginBottom = overlap > 0 ? `${overlap}px` : '0px';
            } else {
                heroBtnWrapper.style.marginBottom = '0px';
            }
        });
    }

    // 5. 서브페이지 전용 CONTACT 버튼(.sub-contact-wrapper) 푸터 겹침 방지
    const subBtnWrapper = document.querySelector('.sub-contact-wrapper');
    if (subBtnWrapper) {
        window.addEventListener('scroll', () => {
            const footer = document.querySelector('.site-footer');
            if (!footer) return;

            const footerTop = footer.getBoundingClientRect().top;
            const overlap = window.innerHeight - footerTop;

            subBtnWrapper.style.marginBottom = overlap > 0 ? `${overlap}px` : '0px';
        });
    }
});

// 6. GSAP 스크롤 애니메이션 (load 시점에 실행 — 서브페이지 버전 기준으로 통일)
window.addEventListener("load", () => {
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }

        // 첫 화면 히어로 배너 효과
        gsap.fromTo(".hero-reveal",
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1.5, ease: "power2.out",
                clearProps: "transform"
            }
        );

        // 히어로 배경 이미지 페이드 (홈 전용, 없으면 아무 동작 안 함)
        gsap.utils.toArray(".hero-fade-item").forEach((item) => {
            gsap.fromTo(item,
                { opacity: 0.5 },
                {
                    opacity: 1, duration: 1,
                    scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none none" }
                }
            );
        });

        // 스크롤 시 순차적으로 나타나는 효과
        gsap.utils.toArray(".reveal-item").forEach((item) => {
            gsap.fromTo(item,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1,
                    clearProps: "transform",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // 화면이 다 그려지고 0.1초 뒤에 ScrollTrigger 위치 재계산
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    }
});
