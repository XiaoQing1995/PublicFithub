<template>
  <h1>{{ courseName }}課程課表</h1>
  <FullCalendar :options="calendarOptions" />
</template>

<script setup>
/*
  imports
*/
import { ref, reactive, onUpdated } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";

/*
  props
*/
const props = defineProps({
  courseName: String,
  calendarEvents: Array,
});

/*
  Emit
*/
const emit = defineEmits(["clickCalendarClassEmit"]);

/*
  initial value
*/
// 取得下一個月的第一天
var initialDate = new Date();
initialDate.setMonth(initialDate.getMonth() + 1);
initialDate.setDate(1);

/*
  Build FullCalendar
*/
const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: "dayGridMonth",
  weekends: true,
  height: 650,
  aspectRatio: 1,
  initialDate: initialDate,
  // timeZone: 'UTC',
  locale: "en-us",
  headerToolbar: {
    left: "",
    center: "title",
    right: "",
  },
  titleFormat: {
    year: "numeric",
    month: "long",
  },
  // buttonText: { today: "今日" },
  events: [],
  eventColor: "#ffc408",
  interactive: true,
  eventClick: (eventClickInfo) => {
    // console.log(eventClickInfo.event._def.publicId);
    let classId = eventClickInfo.event._def.publicId;
    emit("clickCalendarClassEmit", classId);
  },
});

/*
  LifeCycle Hooks
*/
onUpdated(() => {
  // When courseCalendar onMounted, props.calendarEvents still got no value
  calendarOptions.value.events = props.calendarEvents;
});
</script>

<style scoped></style>
