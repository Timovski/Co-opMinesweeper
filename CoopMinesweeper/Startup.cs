using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoopMinesweeper.Hubs;
using CoopMinesweeper.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CoopMinesweeper
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddSignalR().AddHubOptions<GameHub>(options =>
            {
                options.ClientTimeoutInterval = TimeSpan.FromSeconds(300);
                options.KeepAliveInterval = TimeSpan.FromSeconds(150);
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowCoopMinesweeper", builder =>
                {
                    builder.WithOrigins(Configuration["AppSettings:CoopMinesweeperUrl"],
                                        Configuration["AppSettings:CoopMinesweeperWwwUrl"])
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials()
                           .SetPreflightMaxAge(TimeSpan.FromDays(20));
                });
            });

            services.AddSingleton<IGameService, GameService>();
            services.AddHostedService<TimedHostedService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors("AllowCoopMinesweeper");
            app.UseStaticFiles();
            app.UseMvc();
            app.UseSignalR(routes =>
            {
                routes.MapHub<GameHub>("/gameHub");
            });
        }
    }
}
