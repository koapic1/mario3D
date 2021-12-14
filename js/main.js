const charListUL = $("#main #charList");
let charSlider = null;
let itemTweener = null;
let total = 0;
const zAmount = 5000;
const wheelStep = zAmount / 10;
let _z = 0;
loadJson("../data/mario.json");
function loadJson(jsondata) {
    $.ajax({
        url: jsondata,
        success: function (res) {
            //console.log(res.items);
            const charList = res.items;
            let output = "";
            total = charList.length;
            _z = 0;
            $.each(charList, function (idx, item) {
                output += `
                <li style="background:${item.bg}; transform:translateZ(${-zAmount * idx}px); z-index:${total - idx}">
                    <div class="img">
                        <img src="${item.img}">
                    </div>
                    <div class="info">
                        <h2 class="title" data-splitting>${item.title}</h2>
                        <p class="desc" data-splitting>${item.desc}</p>
                        <p class="link" data-splitting><a href="${item.link}" target="${item.target}">MORE</a></p>
                    </div>
                </li>
                `;
            });
            charListUL.html(output);
        },
        error: function (err) {
            //console.log(err);
            //alert(err.statusText);
            location.href = "error.html";
            return;
        },
    });
}

const gnbList = $("#gnb li");
gnbList.on("click", function (e) {
    e.preventDefault();
    const jsonFile = $(this).data("json");
    if ($(this).hasClass("selected")) return;
    $(this).addClass("selected").siblings("li").removeClass("selected");
    loadJson(jsonFile);
});

$(window).on("mousewheel", function (e) {
    //console.log(e.originalEvent.deltaX);
    const wheel = e.originalEvent.deltaY;
    if (wheel > 0) {
        //console.log("아래로");
        _z += wheelStep;
        if (_z > zAmount * (total - 1)) {
            _z = zAmount * (total - 1);
            return;
        }
    } else {
        //console.log("위로");
        _z -= wheelStep;
        if (_z < 0) {
            _z = 0;
            return;
        }
    }
    $("#charList li").each(function (idx, item) {
        gsap.to(item, { z: _z - zAmount * idx });
    });
});
