document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    let participantsData = [];
    const grid = document.getElementById('participantsGrid');
    const searchInput = document.getElementById('searchInput');
    const profileModal = document.getElementById('profileModal');
    const closeModal = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');

    fetch('participantes.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar participantes.');
            return response.json();
        })
        .then(data => {
            participantsData = data;
            renderParticipants(participantsData);
        })
        .catch(error => {
            console.error('Error:', error);
            grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-muted);">No se pudieron cargar los datos.</p>';
        });

    function renderParticipants(list) {
        grid.innerHTML = '';
        if (list.length === 0) {
            grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-muted);">No se encontraron participantes.</p>';
            return;
        }

        list.forEach(p => {
            const card = document.createElement('div');
            card.className = 'participant-card';
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${p.foto}" alt="${p.nombre} ${p.apellido}">
                </div>
                <div class="card-info">
                    <div>
                        <h3>${p.nombre} ${p.apellido}</h3>
                        <div class="card-role">${p.cargo}</div>
                        <div class="card-assoc">${p.asociacion}</div>
                    </div>
                    <button class="btn-profile" data-id="${p.id}">Ver perfil</button>
                </div>
            `;
            grid.appendChild(card);
        });

        document.querySelectorAll('.btn-profile').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                openModal(id);
            });
        });
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = participantsData.filter(p => 
            p.nombre.toLowerCase().includes(query) ||
            p.apellido.toLowerCase().includes(query) ||
            p.cargo.toLowerCase().includes(query)
        );
        renderParticipants(filtered);
    });

    function openModal(id) {
        const p = participantsData.find(item => item.id === id);
        if (!p) return;

        modalBody.innerHTML = `
            <div class="modal-header-bg">
                <img src="${p.foto}" alt="${p.nombre}" class="modal-avatar">
                <h2>${p.nombre} ${p.apellido}</h2>
                <div class="modal-role">${p.cargo}</div>
            </div>
            <div class="modal-content-body">
                <div class="modal-info-row">
                    <strong>Asociación:</strong>
                    <span>${p.asociacion}</span>
                </div>
                <div class="modal-info-row">
                    <strong>Distrito:</strong>
                    <span>${p.distrito}</span>
                </div>
                <div class="modal-info-row">
                    <strong>Iglesia:</strong>
                    <span>${p.iglesia}</span>
                </div>
                <div class="modal-info-row">
                    <strong>Teléfono:</strong>
                    <span>${p.telefono}</span>
                </div>
                <div class="modal-info-row" style="border-bottom:none;">
                    <strong>Correo:</strong>
                    <span>${p.correo}</span>
                </div>
                <div class="modal-bio">
                    <p><strong>Biografía:</strong> ${p.biografia}</p>
                </div>
            </div>
        `;

        profileModal.classList.add('active');
    }

    closeModal.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove('active');
        }
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Gracias por escribirnos! Tu mensaje ha sido enviado con éxito.');
            contactForm.reset();
        });
    }
});
