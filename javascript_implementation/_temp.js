/**
 * [kolor-picker]{@link https://github.com/emn178/kolor-picker}
 *
 * @version 0.2.0
 * @author Yi-Cyuan Chen [emn178@gmail.com]
 * @copyright Yi-Cyuan Chen 2015-2016
 * @license MIT
 */
(function ($) {
  'use strict';

  var KEY = 'kolor-picker';
  var wrapper;

  function Wrapper(element, colorPicker) {
    this.element = element;
    this.colorPicker = colorPicker;
    this.previewElement = $('<div class="kolor-picker"><div class="sampler"></div><div class="preview-block"><input type="text"/><div class="preview-wrapper"><div class="preview" /></div></div></div>');
    this.element.append(this.previewElement);

    var elements = {
      preview: this.previewElement.find('.preview'),
      input: this.previewElement.find('input'),
      sampler: this.previewElement.find('.sampler'),
      alpha: this.element.find('.cp-alpha')
    };
    this.elements = elements;
    elements.sampler.click(this.enableSampler.bind(this));

    this.sampling = false;
    this.lastToggled = false;
  }

  Wrapper.prototype.enableSampler = function () {
    if (!this.kolorPicker.canvas) {
      return;
    }
    this.kolorPicker.canvas.colorSampler('enable');
    this.sampling = true;
    this.colorPicker.toggle(false);
  };

  Wrapper.prototype.setKolorPicker = function (kolorPicker) {
    this.kolorPicker = kolorPicker;
    this.element.attr('data-theme', kolorPicker.theme);
    this.elements.sampler.toggle(!!kolorPicker.canvas);
    this.elements.alpha.toggle(kolorPicker.options.opacity !== false);
    if (kolorPicker.options.doRender === undefined) {
      this.colorPicker.color.options.doRender = true;
    } else {
      this.colorPicker.color.options.doRender = kolorPicker.options.doRender;
    }
  };

  Wrapper.prototype.getColor = function () {
    return this.color.toString();
    // var rgb = this.colorPicker.color.colors.rgb;
    // return 'rgba(' + [parseInt(rgb.r * 255), parseInt(rgb.g * 255), parseInt(rgb.b * 255), this.colorPicker.color.colors.alpha.toFixed(2)].join(',') + ')';
  };

  Wrapper.prototype.updateColor = function () {
    var color = this.getColor();
    this.elements.preview.css('background-color', color);
    this.elements.input.val(color);
    this.kolorPicker.changeColor(color);
  };

  Wrapper.prototype.render = function (toggled) {
    if (toggled === undefined) {
      this.updateColor();
    } else if (this.lastToggled === toggled) {
      return;
    }
    this.lastToggled = toggled;
    if (toggled === false) {
      if (!this.sampling) {
        var color = this.getColor();
        this.kolorPicker.selectColor(color);
      }
    } else {
      this.updateColor();
    }
  };

  function KolorPicker(element, options) {
    this.element = element;
    this.options = options || {};
    this.canvas = this.options.canvas;
    this.theme = this.options.theme || $.kolorPicker.theme;

    if (this.canvas) {
      this.canvas = $(this.canvas);
      this.canvas.colorSampler().colorSampler('disable')
        .bind('sampler:preview', this.onSamplerPreview.bind(this))
        .bind('sampler:select', this.onSamplerSelect.bind(this));
    }
  }

  KolorPicker.prototype.onSamplerSelect = function (e, color) {
    if (wrapper.kolorPicker != this) {
      return;
    }
    wrapper.sampling = false;
    this.canvas.colorSampler('disable');
    this.setColor(color);
    color = wrapper.getColor();
    this.selectColor(color);
  };

  KolorPicker.prototype.onSamplerPreview = function (e, color) {
    if (wrapper.kolorPicker != this) {
      return;
    }
    this.element.css('background-color', color);
    color = wrapper.getColor();
    this.changeColor(color);
  };

  KolorPicker.prototype.selectColor = function (color) {
    if ($.isFunction(this.options.onSelect)) {
      this.options.onSelect.call(this.element, color);
    }
  };

  KolorPicker.prototype.changeColor = function (color) {
    if ($.isFunction(this.options.onChange)) {
      this.options.onChange.call(this.element, color);
    }
  };

  KolorPicker.prototype.setColor = function (color) {
    wrapper.colorPicker.color.setColor(color);
    wrapper.colorPicker.render();
  };

  var KolorPickerOptions = {
    buildCallback: function (element) {
      wrapper = new Wrapper(element, this);
    },

    renderCallback: function (element, toggled) {
      wrapper.setKolorPicker($(element).data(KEY));
      wrapper.render(toggled);
    }
  };

  var PublicMethods = ['setColor'];
  $.fn.kolorPicker = function (options) {
    if (typeof (options) == 'string') {
      if ($.inArray(options, PublicMethods) != -1) {
        var args = Array.prototype.splice.call(arguments, 1);
        this.each(function () {
          var kolorPicker = $(this).data(KEY);
          if (kolorPicker) {
            return kolorPicker[options].apply(kolorPicker, args);
          }
        });
      }
    } else {
      this.each(function () {
        var element = $(this);
        if (!element.data(KEY)) {
          return element.data(KEY, new KolorPicker(element, options))
            .colorPicker($.extend({ cssAddon: $.kolorPicker.css }, options, KolorPickerOptions));
        }
      });
    }
    return this;
  };

  $.kolorPicker = {
    theme: ''
  };
})(jQuery);