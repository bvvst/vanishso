<div
  class="shadow-lg flex flex-col m-auto bg-dark overflow-hidden border border-[#BC9CFF]/10 rounded-3xl max-w-[310px] w-full"
>
  <div class="flex flex-col items-center border-b border-[#0D0C10] p-6">
    <slot name="header" />
  </div>
  <div class="flex flex-col border-t border-[#BC9CFF]/10 p-6">
    <slot name="content" />
  </div>
</div>
