interface Nikke {
    id?: number;
    name: string;
    rarity: number;
    manufacturer: string;
    element: string;
    weapon: string;
    role: string;
    squad: string;
    burst: number;
}

async function fetchData(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/nikkes');
        const data: Nikke[] = await response.json();
        const listElement = document.getElementById('nikkes');
        if (!listElement) return;
        listElement.innerHTML = data.map(nikke => {
            const rarityMap: Record<number, string> = { 1: 'r', 2: 'sr', 3: 'ssr' };
            const rarityName = rarityMap[Number(nikke.rarity)] || 'ssr';
            return `
                <div class="card">
                    <h2>${nikke.name}</h2>
                    <img src="/images/${rarityName}.webp" width="48" height="48" class="rarity-icon"> 
                    <img src="/images/${nikke.manufacturer.toLowerCase()}.webp" width="48" height="48" title="${nikke.manufacturer}">
                    <img src="/images/${nikke.element.toLowerCase()}.webp" width="48" height="48" title="${nikke.element}">
                    <img src="/images/b${nikke.burst}.webp" width="45" height="48" title="Burst ${nikke.burst}">
                    <img src="/images/${nikke.role.toLowerCase()}.webp" width="40" height="48" title="${nikke.role}">
                    <img src="/images/${nikke.weapon.toLowerCase()}.webp" width="48" height="48" title="${nikke.weapon}">
                    <p><b>Squad:</b> ${nikke.squad}</p>
                    <button class="delete-btn" onclick="deleteNikke(${nikke.id})">
                        <i class="fa fa-trash"></i> Delete
                    </button>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error("Failed to fetch:", error);
    }
}

const form = document.getElementById('nikkeForm') as HTMLFormElement;
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: (document.getElementById('name') as HTMLInputElement).value,
            rarity: Number((document.getElementById('rarity') as HTMLInputElement).value),
            manufacturer: (document.getElementById('manufacturer') as HTMLInputElement).value,
            element: (document.getElementById('element') as HTMLInputElement).value,
            burst: Number((document.getElementById('burst') as HTMLInputElement).value),
            role: (document.getElementById('role') as HTMLInputElement).value,
            weapon: (document.getElementById('weapon') as HTMLInputElement).value,
            squad: (document.getElementById('squad') as HTMLInputElement).value,
        };
        
        try {
            const response = await fetch('http://localhost:3000/nikkes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                console.log("Nikke added!");
                form.reset();
                fetchData();
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    });
}

(window as any).deleteNikke = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Nikke?")) return;
    try {
        const response = await fetch(`http://localhost:3000/nikkes/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchData();
        }
    } catch (error) {
        console.error("Delete failed:", error);
    }
};

fetchData();

function setupButtonGroup(groupId: string, inputId: string) {
    const group = document.getElementById(groupId);
    const hiddenInput = document.getElementById(inputId) as HTMLInputElement;
    if (!group || !hiddenInput) return;

    const buttons = group.querySelectorAll('button');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            hiddenInput.value = btn.getAttribute('data-value') || "";
        });
    });
}

setupButtonGroup('rarity-group', 'rarity');
setupButtonGroup('manufacturer-group', 'manufacturer');
setupButtonGroup('element-group', 'element');
setupButtonGroup('burst-group', 'burst');
setupButtonGroup('role-group', 'role');
setupButtonGroup('weapon-group', 'weapon');