using CoopMinesweeper.Hubs;
using CoopMinesweeper.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR().AddHubOptions<GameHub>(options =>
{
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(300);
    options.KeepAliveInterval = TimeSpan.FromSeconds(150);
});

builder.Services.AddCors(options =>
{
    var coopMinesweeperUrl = builder.Configuration["AppSettings:CoopMinesweeperUrl"];
    var coopMinesweeperWwwUrl = builder.Configuration["AppSettings:CoopMinesweeperWwwUrl"];

    options.AddPolicy("AllowCoopMinesweeper", builder =>
    {
        builder.WithOrigins(coopMinesweeperUrl, coopMinesweeperWwwUrl)
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials()
               .SetPreflightMaxAge(TimeSpan.FromDays(20));
    });
});

builder.Services.AddSingleton<IGameService, GameService>();
builder.Services.AddHostedService<TimedHostedService>();

builder.WebHost.UseUrls("http://localhost:5010");

var app = builder.Build();
app.UseCors("AllowCoopMinesweeper");
app.UseStaticFiles();

app.MapHub<GameHub>("/gameHub");

app.Run();
