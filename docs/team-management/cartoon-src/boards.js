// Board content per narration segment. data-at = keyword from the narration sentence (or seconds) when the item appears.
const A = (at, k, d) => `data-at="${at}"${k ? ` data-k="${k}"` : ""}${d ? ` data-d="${d}"` : ""}`;
const count = (at, to, dec, from, suf, d) => `<span ${A(at, "count", d)} data-to="${to}" data-dec="${dec}" data-from="${from || 0}" data-suf="${suf || ""}">0</span>`;
const bar = (at, w, color, d) => `<div class="bar" ${A(at, "bar", d)} data-w="${w}" style="background:${color}"></div>`;
const wave = (from, to) => t => (t > from && t < to ? Math.min(1, (t - from) / 0.4, (to - t) / 0.4) : 0);

function planDots(n) {
  return `<div class="dots">${[1,2,3,4,5,6,7].map(i => `<div class="dot ${i === n ? "on" : i < n ? "done" : ""}">${i}</div>`).join("")}</div>`;
}
function planPoint(n, title, sig, chg, kpi, extras) {
  return `<div class="kick">План улучшений · пункт ${n} из 7</div>${planDots(n)}
  <div class="h" style="font-size:44px">${title}</div>
  <div class="col" style="gap:16px">
    <div class="card" ${A(sig[0])} style="border-color:var(--red)"><div class="t26 b" style="color:var(--red)">🚨 Сигнал</div><div class="t30" style="margin-top:6px">${sig[1]}</div></div>
    <div class="card" ${A(chg[0])}><div class="t26 b" style="color:var(--blue)">🔧 Меняем процесс</div><div class="t30" style="margin-top:6px">${chg[1]}</div></div>
    <div class="card" ${A(kpi[0])} style="border-color:var(--green)"><div class="t26 b" style="color:var(--green)">🎯 Показатель</div><div class="t34 b" style="margin-top:6px">${kpi[1]}</div></div>
    ${extras || ""}
  </div>`;
}
const sci = (at, text) => `<div class="pill bl" ${A(at)} style="font-size:24px;padding:10px 18px;align-self:flex-start">📚 ${text}</div>`;

const BOARDS = {
"s01": { block: "Вступление", sub: "Команда ПОУК · 4 участницы", wave: wave(0.3, 4.5), html: `
  <div class="kick" ${A(0.4)}>Видеоразбор проекта · «Управление командой»</div>
  <div class="h" style="font-size:66px" ${A(0.8)}>Что помогает нашей команде и что ей мешает</div>
  <div class="row" style="margin-top:20px">
    <div class="card" ${A("Тест говорит")} style="flex:1"><div class="emo">🧪</div><div class="t30 b" style="margin-top:10px">Тест</div><div class="t30 mut">«ты такая-то»</div></div>
    <div class="card" ${A("Гипотеза говорит")} style="flex:1;border-color:var(--green)"><div class="emo">🔍</div><div class="t30 b" style="margin-top:10px">Рабочая гипотеза</div><div class="t30 mut">«похоже, дело в этом — проверим»</div></div>
  </div>
  <div class="card" ${A("часть наших гипотез")} style="margin-top:28px;background:var(--yellow-soft);border-color:var(--yellow)"><div class="t30 b">Часть гипотез не подтвердилась — и это нормально 🙂</div></div>
`},
"s02": { block: "Вступление", sub: "Откуда данные", html: `
  <div class="kick">Данные</div><div class="h">Четыре источника</div>
  <div class="grid2">
    <div class="card" ${A("Первый:")}><div class="big" style="color:var(--blue)">${count("Первый:", 19, 0)}</div><div class="t30 b">утверждений по Ленсиони</div><div class="t26 mut">шкала 1–5, анонимно</div></div>
    <div class="card" ${A("Второй:")}><div class="big" style="color:var(--blue)">${count("Второй:", 6, 0)}</div><div class="t30 b">утверждений о безопасности</div><div class="t26 mut">по Эдмондсон, анонимно</div></div>
    <div class="card" ${A("Третий:")}><div class="big" style="color:var(--blue)">${count("Третий:", 9, 0)}</div><div class="t30 b">ролей Белбина</div><div class="t26 mut">взаимные номинации, <b>не анонимно</b></div></div>
    <div class="card" ${A("Четвёртый источник")}><div class="big">💬</div><div class="t30 b">переписка и история</div><div class="t26 mut">наблюдение, а не измерение</div></div>
  </div>
  <div class="card" ${A("Теперь про теорию")} style="margin-top:26px;text-align:center;background:var(--blue-soft);border-color:var(--blue)"><div class="t34 b">→ одна рабочая гипотеза о команде</div></div>
`},
"s03": { block: "Теория простыми словами", sub: "Шесть «линз»", html: `
  <div class="kick">Теория</div><div class="h">Шесть «линз», через которые смотрим</div>
  <div class="grid3">
    <div class="card" ${A("Начнём с Такмана")} data-active="Начнём с Такмана"><div class="emo">🧳</div><div class="t30 b" style="margin-top:8px">Такман</div><div class="t26 mut">стадии: от вежливости через споры к правилам</div></div>
    <div class="card" ${A("Дальше Катценбах")} data-active="Дальше Катценбах"><div class="emo">🚣</div><div class="t30 b" style="margin-top:8px">Катценбах и Смит</div><div class="t26 mut">от группы в метро к экипажу лодки</div></div>
    <div class="card" ${A("Это не классификация личности")} data-active="Это не классификация личности"><div class="emo">🍳</div><div class="t30 b" style="margin-top:8px">Белбин</div><div class="t26 mut">функции: кто придумывает, кто режет, кто пробует соль</div></div>
    <div class="card" ${A("Ленсиони описывает")} data-active="Ленсиони описывает"><div class="emo">🔺</div><div class="t30 b" style="margin-top:8px">Ленсиони</div><div class="t26 mut">пирамида пяти пороков</div></div>
    <div class="card" ${A("Эдмондсон:")} data-active="Эдмондсон:"><div class="emo">🛟</div><div class="t30 b" style="margin-top:8px">Эдмондсон</div><div class="t26 mut">безопасность: «комфорт» или «научение»</div></div>
    <div class="card" ${A("И рамка")} data-active="И рамка"><div class="emo">🔗</div><div class="t30 b" style="margin-top:8px">GRPI</div><div class="t26 mut">цели → роли → процессы → отношения</div></div>
  </div>
`},
"s04": { block: "Диагностика", sub: "Стадии Такмана", html: `
  <div class="kick">Диагностика · Такман</div><div class="h">Как команда проходила стадии</div>
  <div style="position:relative;height:120px">
    <div ${A("самая обоснованная", "pulse")} style="position:absolute;left:41%;top:0;transform-origin:center" ><div class="pill bl" style="font-size:28px;padding:10px 20px">📍 мы здесь</div></div>
  </div>
  <div class="row" style="gap:12px">
    <div class="card" ${A("Сначала формировалась")} style="flex:1;padding:18px"><div class="emo">🤝</div><div class="t26 b" style="margin-top:8px">Формиро­вание</div><div class="t26 mut" style="font-size:21px">название и задача — не сразу</div></div>
    <div class="card" ${A("Потом бурление")} style="flex:1;padding:18px"><div class="emo">⚡</div><div class="t26 b" style="margin-top:8px">Бурление</div><div class="t26 mut" style="font-size:21px">разные ожидания, ирония</div></div>
    <div class="card" ${A("Потом нормирование")} style="flex:1;padding:18px;background:var(--blue-soft);border-color:var(--blue)"><div class="emo">📜</div><div class="t26 b" style="margin-top:8px">Нормиро­вание</div><div class="t26" style="font-size:21px">устав: связь, сроки, решения</div></div>
    <div class="card" ${A("Функционирование мы указываем")} style="flex:1;padding:18px;border-style:dashed"><div class="emo">🚀</div><div class="t26 b" style="margin-top:8px">Функциони­рование</div><div class="t26 mut" style="font-size:21px">предварительно</div></div>
    <div class="card" ${A("А роспуск")} style="flex:1;padding:18px;opacity:.5"><div class="emo">👋</div><div class="t26 b" style="margin-top:8px">Роспуск</div><div class="t26 mut" style="font-size:21px">не анализируем</div></div>
  </div>
  <div class="card soft" ${A("Но мы не используем")} style="margin-top:30px;background:var(--yellow-soft);border-color:var(--yellow)"><div class="t30"><b>Шутки ≠ избегание конфликтов:</b> анкета показывает, что о несогласии говорят открыто</div></div>
  <div class="card soft" ${A("В журнале решений")} style="margin-top:18px"><div class="t26">📒 Описывать стадии ретроспективно — решение № 6 в журнале</div></div>
`},
"s05": { block: "Диагностика", sub: "Тип команды по Катценбаху и Смиту", html: `
  <div class="kick">Диагностика · Катценбах и Смит</div><div class="h">Какая мы команда?</div>
  <div style="position:relative;margin:30px 10px 70px">
    <div style="height:22px;border-radius:11px;background:linear-gradient(90deg,#d8cfbf,var(--blue));border:4px solid var(--ink)"></div>
    <div data-marker='[[0.4,4],["Псевдокоманда",28],["Реальная команда",68],["Это потенциальная",50]]' style="position:absolute;top:-58px;transform:translateX(-50%);font-size:52px">🔻</div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);margin-top:16px;font-size:22px;text-align:center;font-weight:700" class="mut">
      <span>Рабочая группа</span><span>Псевдо­команда</span><span style="color:var(--blue)">Потенци­альная</span><span>Реальная</span><span>Высоко­эффективная</span>
    </div>
  </div>
  <div class="grid2">
    <div class="card" ${A("четыре и семьдесят пять")} style="border-color:var(--green)"><div class="big" style="color:var(--green)">${count("четыре и семьдесят пять", 4.75, 2)}</div><div class="t30 b" style="margin-top:8px">одинаковое понимание цели</div><div class="t26 mut">цель есть → не псевдокоманда</div></div>
    <div class="card" ${A("И взаимная проверка")} style="border-color:var(--red)"><div class="big" style="color:var(--red)">${count("И взаимная проверка", 3.25, 2)}</div><div class="t30 b" style="margin-top:8px">«сдано и проверено»</div><div class="t26 mut">ответственность не закреплена → ещё не реальная</div></div>
  </div>
`},
"s06": { block: "Диагностика", sub: "Роли Белбина", html: `
  <div class="kick">Диагностика · Белбин</div><div class="h">40 номинаций по девяти ролям</div>
  ${[["Реализатор",8],["Генератор идей",7],["Душа команды",6],["Разведчик",5],["Аналитик",5],["Активизатор",4],["Координатор",3],["Завершитель",2],["Эксперт",0]].map(([n,v],i)=>{
    const red = v<=2, c = red ? "var(--red)" : i<3 ? "var(--blue)" : "#9aa1ad";
    return `<div class="barrow" ${A("Теперь роли", "fade", i*0.25)}><span class="${red?"b":""}" style="${red?"color:var(--red)":""}">${n}</span><div class="bartrack">${bar("Теперь роли", v/8*100, c, i*0.25)}</div><span class="num">${v}</span></div>`;}).join("")}
  <div class="row" style="margin-top:22px">
    <div class="card" ${A("Ноль номинаций")} style="flex:1;border-color:var(--red)"><div class="t26"><b>0 ≠ нет навыков.</b> Функции экспертизы и проверки ни за кем не закреплены</div></div>
    <div class="card soft" ${A("агрегированы")} style="flex:.7"><div class="t26">👥 Итоги по команде, без имён</div></div>
  </div>
`},
"s07": { block: "Диагностика", sub: "Ленсиони и безопасность", html: `
  <div class="kick">Диагностика · Ленсиони и Эдмондсон</div><div class="h" style="margin-bottom:14px;font-size:42px">Пирамида ровная, слабые места точечные</div>
  <div class="row" style="gap:30px">
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
      ${[["Безразличие к результату","3,83",44],["Нетребовательность","3,94",58],["Обязательства","4,00",72],["Избегание конфликтов","3,94",86],["Недоверие","3,88",100]].map(([n,v,w],i)=>
        `<div ${A("По Ленсиони", "pop", (4-i)*0.45)} style="width:${w}%;background:var(--blue-soft);border:4px solid var(--ink);border-radius:10px;padding:6px 6px;text-align:center;font-size:19px;font-weight:700;line-height:1.15">${n}<br><span style="font-size:28px;font-weight:900">${v}</span></div>`).join("")}
    </div>
    <div style="flex:1.1;gap:10px" class="col">
      <div class="t26 b mut" ${A("Четыре самых слабых")}>Четыре слабых утверждения</div>
      ${[["«Показан команде и проверен»","3,25","r"],["«Доверяем без перепроверки»","3,25","r"],["«Решения принимаются всеми»","3,50","y"],["«Выполняем общее решение»","3,50","y"]].map(([n,v,c],i)=>
        `<div class="row" ${A("Четыре самых слабых", "slide", 0.6+i*0.5)} style="align-items:center;justify-content:space-between;font-size:23px;border-bottom:3px solid #eee3d3;padding-bottom:4px"><span>${n}</span><span class="pill ${c}" style="font-size:26px">${v}</span></div>`).join("")}
      <div class="card" ${A("Психологическая безопасность:")} style="display:flex;align-items:center;gap:18px;background:var(--green-soft);border-color:var(--green);padding:12px 20px"><div class="big" style="font-size:64px;color:var(--green)">${count("Психологическая безопасность:", 4.58, 2)}</div><div class="t26"><b>безопасность</b><br>юмор 5,00 😄</div></div>
      <div class="card soft" ${A("Соблазнительно сравнить")} style="padding:12px 20px;background:var(--yellow-soft);border-color:var(--yellow)"><div class="t26">⚖️ 4,58 против 3,94 — <b>только контраст</b>: шкалы разные</div></div>
    </div>
  </div>
`},
"s08": { block: "Гипотезы", sub: "Шесть гипотез до сбора данных", html: `
  <div class="kick">Гипотезы</div><div class="h" style="margin-bottom:16px">Шесть гипотез, заданных заранее</div>
  <div style="position:relative">
  ${[["1","Команда потенциальная","4,75 и 3,25","g","поддерживается","Первая:"],
     ["2","<b>Главное — избегание конфликтов</b>","3,94; спорить можем","r","не подтвердилась","А теперь вторая"],
     ["3","Проблема — исполнение и проверка","3,25–3,50","g","поддерживается","Третья:"],
     ["4","Безопасность выше дисциплины","4,58 против 3,94","y","только контраст","Четвёртая:"],
     ["5","Завершение и экспертиза не закреплены","2 и 0 номинаций","g","о функциях","Пятая:"],
     ["6","Ожидания по результату различаются","разброс 3,0 → 0,67","y","частично","Шестая:"]].map(([n,h,d,c,res,at])=>
     `<div class="trow" ${A(at,"slide")}><span class="num" style="font-size:28px">${n}</span><span>${h}</span><span class="mut">${d}</span><span><span class="pill ${c}">${res}</span></span></div>`).join("")}
    <div class="stamp" ${A("Она не подтвердилась","stamp")} style="left:590px;top:56px;font-size:30px;padding:4px 14px;border-width:6px;background:rgba(255,255,255,.92)">НЕ ПОДТВЕРДИЛАСЬ</div>
  </div>
  <div class="row" style="margin-top:20px;gap:14px">
    <div class="card" ${A("Во-первых")} style="flex:1;padding:16px"><div class="t26">✅ гипотезу <b>зафиксировали заранее</b></div></div>
    <div class="card" ${A("Во-вторых")} style="flex:1;padding:16px"><div class="t26">✅ шутки <b>≠</b> избегание конфликтов</div></div>
    <div class="card" ${A("В-третьих")} style="flex:1;padding:16px"><div class="t26">✅ это <b>изменило план</b></div></div>
  </div>
`},
"s09:1": { block: "План улучшений", sub: "Сигнал → изменение → показатель", html: planPoint(1, "Критерий готовности и проверяющая",
  ["Сигнал:", "«сделано» ≠ «проверено» — 3,25"], ["Меняем процесс", "исполнительница + проверяющая + срок; «Готово» = проверено по первоисточнику"], ["Показатель:", "3,25 → 4,0 и выше"]) },
"s09:2": { block: "План улучшений", sub: "Сигнал → изменение → показатель", html: planPoint(2, "Промежуточные сроки и режим только правок",
  ["Сигнал:", "работа рывками: пауза 14 дней"], ["Меняем:", "внутренний срок за 48 часов — только проверка и правки; контрольные точки"], ["Отдельного показателя", "без KPI: проверяем по журналу и трекеру"],
  sci("Здесь опора на Герсик", "Герсик: темп резко растёт к середине срока")) },
"s09:3": { block: "План улучшений", sub: "Сигнал → изменение → показатель", html: planPoint(3, "Структура принятия решений",
  ["Сигнал:", "«решения всеми» и «выполняем решение» — 3,50; риск 2 на 2"], ["Меняем:", "письменно → круг без перебиваний → решение; квадрат Декарта"], ["Показатель:", "обе оценки 3,50 → 4,0 и выше"],
  `<div class="row" style="gap:12px">${sci("премортем по Клейну", "Клейн: премортем при 2 на 2")}${sci("Стассера", "Стассер: уникальная информация")}</div>`) },
"s09:4": { block: "План улучшений", sub: "Сигнал → изменение → показатель", html: planPoint(4, "Ротация завершения и экспертизы",
  ["Сигнал:", "Завершитель 2, Эксперт 0 из 40"], ["Меняем:", "автор + две проверяющие, роли по кругу; пробный опрос за 3 дня"], ["Показатель:", "≥ 80% верных ответов у каждой"]) },
"s09:5": { block: "План улучшений", sub: "Сигнал → изменение → показатель", html: planPoint(5, "Еженедельная ретроспектива",
  ["Сигнал:", "оценки «результатов» от 2 до 5"], ["Меняем:", "15 минут раз в неделю: помогло · мешало · риск · одно изменение"], ["Показатель:", "разброс 3,0 → 1,5 и ниже"],
  `<div class="row" style="gap:12px">${sci("Опора на Лайнс", "Лайнс и др.: рефлексия")}<div class="pill y" ${A("честная оговорка")} style="font-size:24px;padding:10px 18px">⚠️ регулярно не проводились</div></div>`) },
"s09:6": { block: "План улучшений", sub: "Сигнал → изменение → показатель", html: planPoint(6, "Сверка нагрузки по факту",
  ["Сигнал:", "расхождение самооценки и оценки коллег — 0,92"], ["Меняем:", "раз в неделю: сделано · блокеры · перераспределение"], ["Показателей два", "0,92 → ≤ 0,5 · отклонение 17,9 → ≤ 10 п.п."],
  sci("Опора на Карау", "Карау и Уильямс: видимый вклад")) },
"s09:7": { block: "План улучшений", sub: "Сигнал → изменение → показатель", html: planPoint(7, "Матрица контрольного измерения",
  [0.3, "нужно проверить эффект"], [1.6, "повторный замер теми же формулировками"], [3.5, "→ таблица результатов"]) },
"s09:kpi": { block: "План улучшений", sub: "Откуда взялись пороги", html: `
  <div class="kick">Целевые значения</div><div class="h">Откуда пороги</div>
  <div class="col">
    <div class="card" ${A("четыре и выше")}><div class="row" style="align-items:center"><div class="big" style="font-size:80px;color:var(--blue)">≥ 4,0</div><div class="t30">= лучший уровень Ленсиони (обязательства, 4,00): подтянуть слабое до сильного</div></div></div>
    <div class="card" ${A("Пороги в десять")}><div class="row" style="align-items:center"><div class="big" style="font-size:64px;color:var(--blue)">10 · 80%</div><div class="t30">прямо из устава 📜</div></div></div>
    <div class="card" ${A("А пороги для разброса")}><div class="row" style="align-items:center"><div class="big" style="font-size:64px;color:var(--blue)">≈ ½</div><div class="t30">≤ 1,5 и ≤ 0,5 — примерно вдвое меньше исходного</div></div></div>
    <div class="card soft" ${A("Это ориентир")} style="background:var(--yellow-soft);border-color:var(--yellow)"><div class="t30 b">Ориентир, а не статистический расчёт</div></div>
  </div>
`},
"s10": { block: "План улучшений", sub: "Научные опоры", html: `
  <div class="kick">Научные опоры</div><div class="h">Почему это может сработать</div>
  <div class="grid3">
    ${[["⏱️","Герсик","контрольные точки"],["🪦","Клейн","премортем"],["✍️","Стассер","письменные позиции"],["🔁","Лайнс и др.","ретроспектива"],["👀","Карау и Уильямс","видимый вклад"]].map(([e,n,w],i)=>
      `<div class="card" ${A(0.3,"pop",i*0.9)}><div class="emo">${e}</div><div class="t30 b" style="margin-top:8px">${n}</div><div class="t26 mut">→ ${w}</div></div>`).join("")}
    <div class="card" ${A("Поэтому мы называем")} style="background:var(--yellow-soft);border-color:var(--yellow)"><div class="emo">🧪</div><div class="t30 b" style="margin-top:8px">Пробные шаги</div><div class="t26">проверяем практикой</div></div>
  </div>
`},
"s11": { block: "Результаты", sub: "Повторный замер", html: `
  <div class="row" style="align-items:center;justify-content:space-between"><div><div class="kick">Повторный замер</div><div class="h" style="margin-bottom:10px">Цели достигнуты</div></div>
    <div class="card" ${A("Из семи целей","pulse")} style="background:var(--green-soft);border-color:var(--green);padding:12px 26px"><span class="big" style="font-size:84px;color:var(--green)">5 / 7</span> <span class="emo">🎯</span></div></div>
  <div class="rrow mut" style="font-size:20px;font-weight:800;text-transform:uppercase"><span>Показатель</span><span>было</span><span>цель</span><span>стало</span><span>итог</span></div>
  ${[["«Показан и проверен»",3.25,"≥ 4,0",5,2,"g","достигнуто","Результат показан команде"],
     ["«Решения всеми»",3.5,"≥ 4,0",4.5,2,"g","достигнуто","Решения принимаются всеми"],
     ["«Выполняем решение»",3.5,"≥ 4,0",4.5,2,"g","достигнуто","Решения принимаются всеми"],
     ["Разброс «результатов»",3,"≤ 1,50",0.67,2,"g","достигнуто","Разброс по блоку"],
     ["Пробный опрос, минимум",0,"≥ 80%",80,0,"g","впритык, без запаса","Пятая достигнутая"],
     ["Расхождение по вкладу",0.92,"≤ 0,50",0.67,2,"y","лучше, но не цель","Расхождение самооценки"],
     ["Отклонение доли задач, п.п.",17.9,"≤ 10",12.5,1,"y","лучше, но не цель","Максимальное отклонение"]].map(([n,b,g,f,dec,c,res,at],i)=>
     `<div class="rrow" ${A(at,"slide",i===2?0.8:0)}><span>${n}</span><span class="num mut">${b?String(b.toFixed(dec)).replace(".",","):"—"}</span><span class="num">${g}</span><span class="num" style="color:var(--${c==="g"?"green":"yellow"})">${count(at, f, dec, b, i===4?"%":"", i===2?0.8:0)}</span><span><span class="pill ${c}">${res}</span></span></div>`).join("")}
  <div class="card soft" ${A("главное предупреждение")} style="margin-top:16px;background:var(--yellow-soft);border-color:var(--yellow)"><div class="t26">⚠️ Только направление: 4 участницы, короткий срок, знали цели замера</div></div>
`},
"s12:lim": { block: "Ограничения", sub: "Честные оговорки", html: `
  <div class="kick">Ограничения</div><div class="h" style="margin-bottom:20px">Чего мы не можем утверждать</div>
  <div class="col" style="gap:12px">
    ${[["Первое:","👩‍👩‍👧‍👧","4 участницы — выводы только о нашей команде"],["Второе:","📋","анкеты не валидированы; Белбин — номинации, не тест"],["Третье:","🙊","неанонимная часть → социально желательные ответы"],["Четвёртое:","🔎","анализ проводили сами участницы"],["Пятое:","🔁","повторный опрос: те же участницы, знали цели"]].map(([at,e,tx])=>
      `<div class="row" ${A(at,"slide")} style="align-items:center;gap:18px;font-size:28px"><span class="emo" style="font-size:40px">${e}</span><span>${tx}</span></div>`).join("")}
    <div class="card" ${A("И шестое")} style="border-color:var(--red);background:var(--red-soft)"><div class="t30"><b>Ретро и сверка нагрузки не проводились регулярно → причинность не заявляем</b></div></div>
    <div class="card" ${A("Защита от подгонки")} style="border-color:var(--green)"><div class="t26">🛡️ Гипотезы — до данных, правила KPI — до подсчёта</div></div>
  </div>
`},
"s12:concl": { block: "Заключение", sub: "Три вывода", html: `
  <div class="kick">Итог</div><div class="h">Три вывода</div>
  <div class="col">
    <div class="card" ${A("Подведём итог")}><div class="t30"><b>1.</b> Нормирование, потенциальная команда: цель и безопасность есть, нет критерия готовности, проверки и владельца решения</div></div>
    <div class="card" ${A("Второе, главный")} style="border-color:var(--blue)"><div class="t30"><b>2.</b> Гипотеза о конфликтах отвергнута — проблема в процессах исполнения</div></div>
    <div class="card" ${A("Третье:")}><div class="t30"><b>3.</b> 5 из 7 целей → функционирование <i>предварительно</i></div></div>
    <div class="card soft" ${A("Что дальше")} style="background:var(--blue-soft);border-color:var(--blue)"><div class="t26">➡️ Регулярные ретро и сверка · дотянуть два показателя · проверить, держатся ли правила</div></div>
  </div>
`},
"s13": { block: "Спасибо!", sub: "", wave: wave(0.2, 99), html: `
  <div style="text-align:center;margin-top:170px">
    <div class="emo" ${A(0.1)} style="font-size:120px">🎉</div>
    <div class="h" ${A(0.4)} style="font-size:110px;margin-top:20px">Спасибо!</div>
    <div class="t34 mut" ${A(1.0)}>Будем рады вопросам</div>
  </div>
`},
};
