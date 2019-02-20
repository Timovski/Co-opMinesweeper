using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoopMinesweeper.Hubs;
using CoopMinesweeper.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace CoopMinesweeper.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IHubContext<GameHub, IGameClient> _gameHubContext;

        public GameController(IGameService gameService, IHubContext<GameHub, IGameClient> gameHubContext)
        {
            _gameService = gameService;
            _gameHubContext = gameHubContext;
        }

        //public async Task SendMessage(string message)
        //{
        //    await _gameHubContext.Clients.All.ReceiveMessage(message);
        //}

        //// POST api/game
        //[HttpPost]
        //[Route("[action]")]
        //public async Task<ActionResult<string>> CreateAsync([FromBody] MyViewModel value)
        //{
        //    var newGameId = _gameService.CreateGame(value.Prop1);
        //    await SendMessage("asdas");

        //    return newGameId;
        //}

        //// POST api/game
        //[HttpPost]
        //[Route("[action]")]
        //public ActionResult<string> Create([FromBody] MyViewModel value)
        //{
        //    var newGameId = _gameService.CreateGame(value.Prop1);
        //    return newGameId;
        //}

        //[HttpPost]
        //[Route("[action]")]
        //public ActionResult<string> GetHostSignal([FromBody] DataModel model)
        //{
        //    var newGameId = _gameService.GetHostSignal(model.Value1);
        //    return newGameId;
        //}

        //[HttpPost]
        //[Route("[action]")]
        //public ActionResult<bool> Join([FromBody] DataModel value)
        //{
        //    var connectionId = _gameService.JoinGame(value.Value1, value.Value2);
        //    _gameHubContext.Clients.Client(connectionId).ReceiveClientSignal(value.Value1);
        //    return true;
        //}

        //[HttpPost]
        //[Route("[action]")]
        //public ActionResult<string> Check([FromBody] DataModel value)
        //{
        //    var clientSignal = _gameService.CheckPeer(value.Value1);
        //    return clientSignal;
        //}

        //[HttpPost]
        //[Route("[action]")]
        //public ActionResult<string> Boo([FromBody] DataModel value)
        //{
        //    var clientSignal = _gameService.CheckPeer(value.Value1);
        //    return clientSignal;
        //}
    }

    public class DataModel
    {
        public string Value1 { get; set; }
        public string Value2 { get; set; }
    }
}
