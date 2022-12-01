const data = {
    items: [],
};

const btn = document.getElementById('addBtn');
const input = document.getElementById('input');

chrome.storage.sync.get(
    /* String or Array */ ['karenProof_BlackList'],
    function ({ karenProof_BlackList }) {
        data.items = karenProof_BlackList ?? [];
        renderBlackList(data.items);
    }
);

function updateDom() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { items: data.items });
    });
}

function addItem(item) {
    chrome.storage.sync.set(
        { karenProof_BlackList: [...(data.items ?? []), item] },
        function () {
            //  Data's been saved boys and girls, go on home
            data.items.push(item);
            renderBlackList(data.items);
            updateDom();
            input.value = '';
        }
    );
}

function removeItem(e) {
    const item = e.target.dataset.item;
    data.items = data.items.filter((i) => i !== item);
    chrome.storage.sync.set({ karenProof_BlackList: data.items }, function () {
        renderBlackList(data.items);
        updateDom();
    });
}

function renderBlackList(items) {
    const el = document.getElementById('blacklist');
    el.innerHTML = '';
    el.append(
        ...items.map((item) => {
            const li = document.createElement('li');
            const removeBtn = Object.assign(document.createElement('button'), {
                type: 'button',
                innerText: 'x',
                onclick: removeItem,
            });
            removeBtn.dataset.item = item;
            li.append(
                Object.assign(document.createElement('span'), {
                    innerText: item,
                }),
                removeBtn
            );
            return li;
        })
    );
}

btn.addEventListener('click', () => {
    if (!input.value) return;
    addItem(input.value);
});
